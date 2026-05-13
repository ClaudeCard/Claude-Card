import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SITE_ORIGINS: Record<string, string> = {
  claudecard:      'https://claudecard.pro',
  granny_frannies: 'https://grannyfrannies.com',
  savvy_scuba:     'https://savvyscuba.com',
  sweet_stone:     'https://sweetstone.com',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  }

  const { token } = await req.json();
  if (!token) {
    return new Response('token required', { status: 400, headers: CORS_HEADERS });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Atomically mark the token as used — prevents replay attacks
  const { data: ssoRow, error } = await supabase
    .from('sso_tokens')
    .update({ used: true })
    .eq('token', token)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .select()
    .single();

  if (error || !ssoRow) {
    return new Response('Invalid or expired token', { status: 401, headers: CORS_HEADERS });
  }

  // Get the user's email
  const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(ssoRow.user_id);
  if (userError || !user) {
    return new Response('User not found', { status: 404, headers: CORS_HEADERS });
  }

  // Resolve the return URL
  const originBase = SITE_ORIGINS[ssoRow.target_site] || 'https://claudecard.pro';
  const redirectTo = `${originBase}${ssoRow.redirect_path || '/'}`;

  // Generate a one-time magic link — single-use, short-lived, lands the user on the target domain
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: user.email!,
    options: { redirectTo },
  });

  if (linkError || !linkData?.properties?.action_link) {
    console.error('generateLink error:', linkError);
    return new Response('Could not generate sign-in link', { status: 500, headers: CORS_HEADERS });
  }

  return new Response(JSON.stringify({
    magic_url: linkData.properties.action_link,
    redirect_path: ssoRow.redirect_path,
    target_site: ssoRow.target_site,
  }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
});
