import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import RewardsPage from './pages/RewardsPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { supabase, hasSupabaseConfig, initialHash, pendingRecovery } from './lib/supabaseClient';
import './styles/globals.css';

function PasswordResetModal() {
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => window.location.replace('/rewards'), 2000);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(12,16,35,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: 'DM Sans, system-ui, sans-serif'
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: '#fff', padding: '2.5rem',
        boxShadow: '0 8px 48px rgba(12,16,35,0.2)'
      }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 700, color: '#0C1023', marginBottom: '1.5rem' }}>
          Claude<span style={{ color: '#C6A05A' }}>Card</span>
        </div>
        {done ? (
          <p style={{ color: '#166534', fontSize: '0.9rem' }}>Password updated. Redirecting to your Passport…</p>
        ) : (
          <>
            <p style={{ color: '#68748E', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Choose a new password for your Passport account.</p>
            {error && <p style={{ fontSize: '0.8rem', color: '#C04040', background: '#FEF2F2', padding: '0.6rem 0.75rem', marginBottom: '0.75rem' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="New password (min 6 characters)" required autoFocus
                style={{ border: '1px solid rgba(80,100,160,0.25)', padding: '0.85rem 1rem', fontSize: '0.88rem', color: '#0C1023', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: '0.75rem' }}
              />
              <button type="submit" disabled={loading} style={{
                background: '#0C1023', color: '#F5F0E8', border: 'none',
                padding: '0.9rem', width: '100%', fontSize: '0.82rem',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit',
                opacity: loading ? 0.7 : 1
              }}>
                {loading ? '…' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  // Initialize from module-level flag — catches events that fire before React mounts
  const [recovering, setRecovering] = useState(
    pendingRecovery || initialHash.includes('type=recovery')
  );

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    // Also listen for late-firing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      {recovering && <PasswordResetModal />}
      <Nav />
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/rewards"       element={<RewardsPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}
