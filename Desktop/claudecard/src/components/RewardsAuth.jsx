import { useEffect, useState } from 'react';
import { hasSupabaseConfig, supabase } from '../lib/supabaseClient';

export default function RewardsAuth() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig) return undefined;

    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setStatus('');
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function sendMagicLink(event) {
    event.preventDefault();
    if (!hasSupabaseConfig) return;

    setLoading(true);
    setStatus('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);
    setStatus(error ? error.message : 'Magic link sent. Check your email to continue.');
  }

  async function logOut() {
    if (!hasSupabaseConfig) return;

    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) setStatus(error.message);
  }

  if (user) {
    return (
      <div className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Signed in</p>
        <p className="mt-2 text-sm font-semibold text-slate-900">{user.email}</p>
        <button
          type="button"
          onClick={logOut}
          disabled={loading}
          className="mt-4 inline-flex items-center justify-center bg-slate-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Logout
        </button>
        {status && <p className="mt-3 text-sm text-slate-600">{status}</p>}
      </div>
    );
  }

  if (!hasSupabaseConfig) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5 text-sm font-medium leading-7 text-yellow-900">
        Rewards auth is ready, but Supabase environment variables are not configured yet. Add
        <span className="font-bold"> VITE_SUPABASE_URL</span> and
        <span className="font-bold"> VITE_SUPABASE_ANON_KEY</span> to enable magic-link login.
      </div>
    );
  }

  return (
    <form onSubmit={sendMagicLink} className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <label htmlFor="rewards-email" className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
        Email Passport Login
      </label>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="rewards-email"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="min-h-12 flex-1 border border-blue-100 bg-blue-50/40 px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 bg-slate-950 px-5 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </div>
      {status && <p className="mt-3 text-sm text-slate-600">{status}</p>}
    </form>
  );
}
