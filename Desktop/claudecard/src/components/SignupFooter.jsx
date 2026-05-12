import { useState, useEffect, useCallback } from 'react';
import { useInView } from '../hooks/useInView';
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient';

const siteKey = import.meta.env.VITE_SITE_KEY || 'claudecard';
const siteName = import.meta.env.VITE_SITE_NAME || 'Claude Card';

const worlds = ["Claude's Creations", "Granny Frannie's", 'Savvy Scuba', 'SweetStone', 'Food Is Love Meal Prep', "Claude's BBQ Club", 'MenuPlan Pro', 'Spiritual Clubhouse', 'Food Is Love Mobile Food Pantry'];
const ecosystem = ['Rewards Circle', 'About Claude', 'Events', 'Volunteer', 'Newsletter'];

const tierLabel = pts =>
  pts >= 1500 ? 'Founding Flame' :
  pts >= 750  ? 'Inner Circle' :
  pts >= 300  ? 'Regular' : 'Taster';

function formatDate(val) {
  if (!val) return '';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(val));
}

export function Signup() {
  const [ref, inView] = useInView();
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [status, setStatus] = useState('idle');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('signin');
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [membership, setMembership] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingPassport, setLoadingPassport] = useState(false);

  const loadPassport = useCallback(async (activeUser) => {
    if (!activeUser || !hasSupabaseConfig) return;
    setLoadingPassport(true);
    try {
      // join_site_membership awards first-time points — fail gracefully
      await supabase.rpc('join_site_membership', { p_site_key: siteKey, p_site_name: siteName }).catch(() => {});

      const [p, m, t] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', activeUser.id).single(),
        supabase.from('site_memberships').select('*').eq('user_id', activeUser.id).eq('site_key', siteKey).single(),
        supabase.from('reward_transactions').select('*').eq('user_id', activeUser.id).order('created_at', { ascending: false }).limit(5),
      ]);
      setProfile(p.data ?? null);
      setMembership(m.data ?? null);
      setTransactions(t.data ?? []);
    } catch (e) {
      console.error('loadPassport error:', e);
    } finally {
      setLoadingPassport(false);
    }
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    // Subscribe FIRST so we never miss an auth event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadPassport(u);
      else { setProfile(null); setMembership(null); setTransactions([]); }
    });
    // Then read current session from localStorage (catches hash redirect tokens)
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadPassport(u);
    });
    return () => subscription.unsubscribe();
  }, [loadPassport]);

  async function handleSignIn() {
    if (!email || !password) { setErrorMsg('Please enter your email and password.'); return; }
    setStatus('loading'); setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setStatus('idle');
    if (error) setErrorMsg(error.message === 'Invalid login credentials' ? 'Incorrect email or password. Try "Forgot password?" if this is your first time signing in with a password.' : error.message);
  }

  async function handleSignUp() {
    if (!email || !password) { setErrorMsg('Please enter email and password.'); return; }
    if (password.length < 6) { setErrorMsg('Password must be at least 6 characters.'); return; }
    setStatus('loading'); setErrorMsg('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    setStatus('idle');
    if (error) { setErrorMsg(error.message); return; }
    if (!data.session) setErrorMsg('Check your email to confirm your account, then sign in.');
  }

  async function handleForgot() {
    if (!email) { setErrorMsg('Enter your email first.'); return; }
    setStatus('loading');
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    setStatus('idle'); setAuthMode('signin');
  }

  async function handleLogout() {
    if (hasSupabaseConfig) await supabase.auth.signOut();
    setUser(null);
    setStatus('idle');
    setEmail('');
  }

  const globalPts = profile?.global_points ?? 0;
  const sitePts = membership?.site_points ?? 0;

  return (
    <section id="circle" ref={ref} className="circle-section" style={{
      padding: '8rem 2.5rem',
      maxWidth: user ? '900px' : '680px',
      margin: '0 auto', position: 'relative',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'all 0.9s ease'
    }}>
      <div style={{
        position: 'absolute', top: '6rem', left: '50%', transform: 'translateX(-50%)',
        width: '1px', height: '60px',
        background: 'linear-gradient(180deg, transparent, rgba(80,100,160,0.42))'
      }} />

      {user ? (
        <>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '1.5rem', textAlign: 'center' }}>
            Ridiculous Passport
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 300, lineHeight: 1.1, color: '#0C1023',
            marginBottom: '3rem', textAlign: 'center'
          }}>
            Welcome back.
          </h2>

          {loadingPassport ? (
            <p style={{ textAlign: 'center', color: '#68748E', fontSize: '0.9rem' }}>Loading your passport…</p>
          ) : (
            <>
              {/* Passport card */}
              <div style={{
                background: '#0C1023', color: '#F5F0E8',
                padding: '2.5rem', marginBottom: '1px',
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '0.5rem' }}>Passport Holder</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500, wordBreak: 'break-all' }}>{user.email}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(198,160,90,0.7)', marginTop: '0.35rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{tierLabel(globalPts)}</p>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(198,160,90,0.15)', borderRight: '1px solid rgba(198,160,90,0.15)', padding: '0 2rem' }}>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '0.5rem' }}>Global Points</p>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 300, lineHeight: 1 }}>{globalPts}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '0.5rem' }}>{siteName} Points</p>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 300, lineHeight: 1 }}>{sitePts}</p>
                </div>
              </div>

              {/* Transactions */}
              <div style={{ border: '1px solid rgba(80,100,160,0.12)', marginBottom: '2rem' }}>
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(80,100,160,0.12)' }}>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A05A' }}>Recent Activity</p>
                </div>
                {transactions.length === 0 ? (
                  <p style={{ padding: '1.25rem 1.75rem', fontSize: '0.82rem', color: '#68748E' }}>No activity yet.</p>
                ) : transactions.map(tx => (
                  <div key={tx.id} style={{
                    padding: '1rem 1.75rem', borderBottom: '1px solid rgba(80,100,160,0.08)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
                  }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#0C1023', fontWeight: 400 }}>{tx.description}</p>
                      <p style={{ fontSize: '0.72rem', color: '#68748E', marginTop: '0.2rem' }}>{tx.site_name || tx.site_key} · {formatDate(tx.created_at)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      {tx.global_points > 0 && (
                        <span style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', background: 'rgba(12,16,35,0.06)', color: '#0C1023', letterSpacing: '0.08em' }}>+{tx.global_points} global</span>
                      )}
                      {tx.site_points > 0 && (
                        <span style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', background: 'rgba(198,160,90,0.1)', color: '#A07830', letterSpacing: '0.08em' }}>+{tx.site_points} site</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button onClick={handleLogout} style={{
                  background: 'none', border: '1px solid rgba(12,16,35,0.2)',
                  padding: '0.65rem 1.75rem', fontSize: '0.75rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#68748E', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                }}>Sign out</button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '1.5rem', textAlign: 'center' }}>
            Join the Circle
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
            fontWeight: 300, lineHeight: 1.1, color: '#0C1023',
            marginBottom: '1.5rem', textAlign: 'center'
          }}>
            Become part of<br />
            the <em style={{ fontStyle: 'italic', color: '#C6A05A' }}>ecosystem.</em>
          </h2>
          <p style={{ color: '#68748E', fontSize: '0.92rem', lineHeight: 1.9, marginBottom: '3rem', textAlign: 'center' }}>
            Early access, secret drops, events, recipes, and member rewards — delivered to you before anyone else.
          </p>

          <>
              {errorMsg && <p style={{ fontSize: '0.78rem', color: '#C04040', marginBottom: '0.75rem', textAlign: 'center' }}>{errorMsg}</p>}
              <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" autoComplete="email"
                  style={{ border: '1px solid rgba(80,100,160,0.25)', background: 'transparent', padding: '0.95rem 1.25rem', fontSize: '0.85rem', color: '#0C1023', outline: 'none', fontFamily: 'DM Sans, sans-serif', width: '100%', boxSizing: 'border-box' }}/>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (authMode === 'signin' ? handleSignIn() : handleSignUp())}
                  placeholder="Password" autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                  style={{ border: '1px solid rgba(80,100,160,0.25)', background: 'transparent', padding: '0.95rem 1.25rem', fontSize: '0.85rem', color: '#0C1023', outline: 'none', fontFamily: 'DM Sans, sans-serif', width: '100%', boxSizing: 'border-box' }}/>
                <button onClick={authMode === 'signin' ? handleSignIn : handleSignUp} disabled={status === 'loading'}
                  style={{ background: '#0C1023', color: '#F5F7FC', border: 'none', padding: '0.95rem', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: status === 'loading' ? 'wait' : 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: status === 'loading' ? 0.7 : 1 }}>
                  {status === 'loading' ? '…' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'rgba(104,116,142,0.8)' }}>
                  <button onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setErrorMsg(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: 'rgba(80,100,160,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
                    {authMode === 'signin' ? 'Create an account →' : '← Back to sign in'}
                  </button>
                  {authMode === 'signin' && <button onClick={handleForgot} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: 'rgba(104,116,142,0.7)', fontFamily: 'DM Sans, sans-serif' }}>Forgot password?</button>}
                </div>
              </div>
            </>
          </>
      )}
    </section>
  );
}

export function Footer() {
  return null;
}
