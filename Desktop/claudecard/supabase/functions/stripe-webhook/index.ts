import Stripe from 'https://esm.sh/stripe@14?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Signature verification failed', { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const meta = session.metadata || {};
  const userId    = meta.user_id || meta.supabase_user_id;
  const siteKey   = meta.rewards_site || meta.site_key;
  const amountCents = session.amount_total || 0;
  const customerEmail = session.customer_email || (session.customer_details as any)?.email;
  const customerId = typeof session.customer === 'string' ? session.customer : null;

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // 1. Sync Stripe customer ID into profiles
  if (customerEmail && customerId) {
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const matchedUser = users?.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());
    if (matchedUser) {
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', matchedUser.id)
        .is('stripe_customer_id', null);
    }
  }

  // 2. Award purchase points if we have a user_id and site_key
  if (userId && siteKey && amountCents > 0) {
    const { data, error } = await supabase.rpc('award_purchase_points', {
      p_user_id:      userId,
      p_site_key:     siteKey,
      p_amount_cents: amountCents,
      p_reference_id: session.id,
      p_description:  `Purchase on ${siteKey} — ${session.id.slice(-8)}`,
    });

    if (error) {
      console.error('award_purchase_points error:', error);
    } else {
      console.log('Points awarded:', data);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
