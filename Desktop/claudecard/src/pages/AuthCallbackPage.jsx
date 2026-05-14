import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export default function AuthCallbackPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const ssoToken     = searchParams.get('sso');

  // By the time this component renders, main.jsx has already restored
  // the hash via window.history.replaceState — so window.location.hash is live
  const hashParams   = new URLSearchParams(window.location.hash.replace('#', ''));
  const isRecovery   = hashParams.get('type') === 'recovery';
  const accessToken  = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  const [mode, setMode]         = useState(isRecovery ? 'reset' : ssoToken ? 'sso' : 'redirect');
  const [ready, setReady]       = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);

  useEffect(() => {
    if (mode === 'reset') {
      // Establish the Supabase session from the hash tokens
      // so that updateUser() has auth context
      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(() => setReady(true));
      } else {
        // Fallback: listen for the PASSWORD_RECOVERY event
        const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
          if (event === 'PASSWORD_RECOVERY') setReady(true);
        });
        return () => subscription.unsubscribe();
      }
    }

    if (mode === 'sso') {
      fetch(`${FUNCTIONS_URL}/sso-exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: ssoToken }),
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.magic_url) window.location.replace(data.magic_url);
          else window.location.replace('/rewards');
        })
        .catch(() => window.location.replace('/rewards'));
    }

    if (mode === 'redirect') {
      window.location.replace('/rewards');
    }
  }, []);

  async function handleReset(e) {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => window.location.replace('/rewards'), 2000);
  }

  const S = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FC', fontFamily: 'DM Sans, system-ui, sans-serif', padding: '2rem' },
    card: { width: '100%', maxWidth: '400px', background: '#fff', padding: '2.5rem', boxShadow: '0 4px 32px rgba(12,16,35,0.08)' },
    logo: { fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 700, color: '#0C1023', marginBottom: '1.5rem' },
    inp:  { border: '1px solid rgba(80,100,160,0.25)', padding: '0.85rem 1rem', fontSize: '0.88rem', color: '#0C1023', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: '0.75rem' },
    btn:  { background: '#0C1023', color: '#F5F0E8', border: 'none', padding: '0.9rem', width: '100%', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' },
    err:  { fontSize: '0.8rem', color: '#C04040', background: '#FEF2F2', padding: '0.6rem 0.75rem', marginBottom: '0.75rem' },
  };

  if (mode === 'reset') {
    return (
      <div style={S.page}>
        <div style={S.card}>
          <div style={S.logo}>Claude<span style={{ color: '#C6A05A' }}>Card</span></div>
          {done ? (
            <p style={{ color: '#166534', fontSize: '0.9rem' }}>Password updated. Redirecting to your Passport…</p>
          ) : !ready ? (
            <p style={{ color: '#68748E', fontSize: '0.88rem' }}>Verifying your reset link…</p>
          ) : (
            <>
              <p style={{ color: '#68748E', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Choose a new password for your account.</p>
              {error && <div style={S.err}>{error}</div>}
              <form onSubmit={handleReset}>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="New password (min 6 characters)" required autoFocus
                  style={S.inp}
                />
                <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
                  {loading ? '…' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600, color: '#0C1023', marginBottom: '1rem' }}>
          Claude<span style={{ color: '#C6A05A' }}>Card</span>
        </div>
        <p style={{ color: '#68748E', fontSize: '0.88rem' }}>
          {mode === 'sso' ? 'Signing you in…' : 'Redirecting…'}
        </p>
      </div>
    </div>
  );
}
