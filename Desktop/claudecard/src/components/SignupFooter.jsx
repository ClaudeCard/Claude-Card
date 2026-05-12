import { useState, useEffect, useCallback } from 'react';
import { useInView } from '../hooks/useInView';
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient';

const siteKey = import.meta.env.VITE_SITE_KEY || 'claudecard';
const siteName = import.meta.env.VITE_SITE_NAME || 'Claude Card';

const worlds = ["Claude's Creations", "Granny Frannie's", 'Savvy Scuba', 'SweetStone', 'Food Is Love Meal Prep', "Claude's BBQ Club", 'MenuPlan Pro', 'Spiritual Clubhouse', 'Food Is Love Mobile Food Pantry'];
const ecosystem = ['Rewards Circle', 'About Claude', 'Events', 'Volunteer', 'Newsletter'];

const TIERS = [
  { name: 'Taster',         min: 0,    next: 300,  color: 'rgba(198,160,90,0.45)' },
  { name: 'Regular',        min: 300,  next: 750,  color: 'rgba(198,160,90,0.65)' },
  { name: 'Inner Circle',   min: 750,  next: 1500, color: 'rgba(198,160,90,0.85)' },
  { name: 'Founding Flame', min: 1500, next: null, color: '#C6A05A'                },
];

const KNOWN_SITES = [
  { key: 'claudecard',     name: 'ClaudeCard',         url: 'claudecard.pro'     },
  { key: 'granny_frannies', name: "Granny Frannie's",   url: 'grannyfrannies.com' },
  { key: 'savvy_scuba',    name: 'Savvy Scuba',        url: 'savvyscuba.com'     },
];

const PERKS = {
  claudecard: {
    Taster:          'Member newsletter & early event info',
    Regular:         'Priority event registration + 5% off select experiences',
    'Inner Circle':  'Invite-only dinners + 10% off experiences',
    'Founding Flame':'Co-creation access + complimentary seat at the table',
  },
  granny_frannies: {
    Taster:          '5% off every order',
    Regular:         '10% off + free shipping on orders over $40',
    'Inner Circle':  '15% off + early access to seasonal drops',
    'Founding Flame':'20% off + monthly surprise box',
  },
  savvy_scuba: {
    Taster:          '5% off dive trips & courses',
    Regular:         '10% off dive trips + gear rentals',
    'Inner Circle':  '15% off + priority booking on sold-out trips',
    'Founding Flame':'20% off + complimentary gear rental on every trip',
  },
};

function tierOf(pts) {
  return [...TIERS].reverse().find(t => pts >= t.min) ?? TIERS[0];
}

function formatDate(val) {
  if (!val) return '';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(val));
}

export function Signup() {
  const [ref, inView] = useInView();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('signin');
  const [status, setStatus]     = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [user, setUser]               = useState(null);
  const [profile, setProfile]         = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingPassport, setLoadingPassport] = useState(false);

  const loadPassport = useCallback(async (activeUser) => {
    if (!activeUser || !hasSupabaseConfig) return;
    setLoadingPassport(true);
    try {
      await supabase.rpc('join_site_membership', { p_site_key: siteKey, p_site_name: siteName }).catch(() => {});
      const [p, m, t] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', activeUser.id).single(),
        supabase.from('site_memberships').select('*').eq('user_id', activeUser.id).order('joined_at', { ascending: true }),
        supabase.from('reward_transactions').select('*').eq('user_id', activeUser.id).order('created_at', { ascending: false }),
      ]);
      setProfile(p.data ?? null);
      setMemberships(m.data ?? []);
      setTransactions(t.data ?? []);
    } catch (e) {
      console.error('loadPassport error:', e);
    } finally {
      setLoadingPassport(false);
    }
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadPassport(u);
      else { setProfile(null); setMemberships([]); setTransactions([]); }
    });
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
    if (error) setErrorMsg(error.message === 'Invalid login credentials'
      ? 'Incorrect email or password.' : error.message);
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
    setErrorMsg('Reset email sent — check your inbox.');
  }

  async function handleLogout() {
    if (hasSupabaseConfig) await supabase.auth.signOut();
    setUser(null); setStatus('idle'); setEmail('');
  }

  // Sum all transactions for accurate cross-site total
  const globalPts  = transactions.reduce((sum, tx) => sum + (tx.global_points || 0), 0) || profile?.global_points || 0;
  const currentTier = tierOf(globalPts);
  const nextTier    = TIERS[TIERS.indexOf(currentTier) + 1] ?? null;
  const progress    = nextTier
    ? Math.round(((globalPts - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100;

  const block = { padding: '1.5rem 1.75rem', border: '1px solid rgba(80,100,160,0.12)', marginBottom: '-1px' };
  const label = { fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '0.75rem' };

  return (
    <section id="circle" ref={ref} className="circle-section" style={{
      padding: '8rem 2.5rem',
      maxWidth: user ? '960px' : '680px',
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
          }}>Welcome back.</h2>

          {loadingPassport ? (
            <p style={{ textAlign: 'center', color: '#68748E', fontSize: '0.9rem' }}>Loading your passport…</p>
          ) : (<>

            {/* ── Header card ── */}
            <div style={{
              background: '#0C1023', color: '#F5F0E8', padding: '2.5rem',
              display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start',
              marginBottom: '1px'
            }}>
              <div>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '0.4rem' }}>Passport Holder</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 500, wordBreak: 'break-all', marginBottom: '0.25rem' }}>{user.email}</p>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: currentTier.color, fontWeight: 600 }}>
                  {currentTier.name}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '0.4rem' }}>Global Points</p>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', fontWeight: 300, lineHeight: 1 }}>{globalPts.toLocaleString()}</p>
              </div>
            </div>

            {/* ── Tier progress ── */}
            <div style={{ ...block, background: '#0C1023', borderColor: 'rgba(198,160,90,0.12)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                {TIERS.map(t => (
                  <div key={t.name} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%', margin: '0 auto 0.4rem',
                      background: globalPts >= t.min ? t.color : 'rgba(198,160,90,0.15)',
                      boxShadow: t.name === currentTier.name ? `0 0 8px ${t.color}` : 'none'
                    }} />
                    <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: t.name === currentTier.name ? t.color : 'rgba(198,160,90,0.35)', fontWeight: t.name === currentTier.name ? 700 : 400 }}>{t.name}</p>
                    <p style={{ fontSize: '0.58rem', color: 'rgba(198,160,90,0.35)', marginTop: '0.15rem' }}>{t.min === 0 ? '0' : t.min.toLocaleString()}+</p>
                  </div>
                ))}
              </div>
              <div style={{ height: '3px', background: 'rgba(198,160,90,0.12)', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: currentTier.color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
              </div>
              {nextTier && (
                <p style={{ fontSize: '0.68rem', color: 'rgba(198,160,90,0.5)', marginTop: '0.75rem', textAlign: 'right' }}>
                  {(nextTier.min - globalPts).toLocaleString()} pts to {nextTier.name}
                </p>
              )}
            </div>

            {/* ── Two column: site breakdown + perks ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', marginBottom: '1px' }}>

              {/* Site breakdown */}
              <div style={{ ...block, marginBottom: 0 }}>
                <p style={label}>Points by Site</p>
                {KNOWN_SITES.map(site => {
                  const mem = memberships.find(m => m.site_key === site.key);
                  return (
                    <div key={site.key} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.65rem 0', borderBottom: '1px solid rgba(80,100,160,0.08)'
                    }}>
                      <div>
                        <p style={{ fontSize: '0.82rem', color: '#0C1023', fontWeight: 500 }}>{site.name}</p>
                        <p style={{ fontSize: '0.68rem', color: '#68748E' }}>{site.url}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {mem ? (
                          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#0C1023', fontWeight: 300 }}>{mem.site_points.toLocaleString()}</p>
                        ) : (
                          <p style={{ fontSize: '0.68rem', color: 'rgba(104,116,142,0.5)', letterSpacing: '0.08em' }}>Not connected</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cross-site perks */}
              <div style={{ ...block, marginBottom: 0 }}>
                <p style={label}>Your Perks — {currentTier.name}</p>
                {KNOWN_SITES.map(site => (
                  <div key={site.key} style={{ padding: '0.65rem 0', borderBottom: '1px solid rgba(80,100,160,0.08)' }}>
                    <p style={{ fontSize: '0.72rem', color: '#C6A05A', fontWeight: 600, marginBottom: '0.2rem' }}>{site.name}</p>
                    <p style={{ fontSize: '0.78rem', color: '#68748E', lineHeight: 1.5 }}>{PERKS[site.key][currentTier.name]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Recent activity ── */}
            <div style={{ ...block, marginBottom: '2rem' }}>
              <p style={label}>Recent Activity</p>
              {transactions.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: '#68748E' }}>No activity yet.</p>
              ) : transactions.slice(0, 6).map(tx => (
                <div key={tx.id} style={{
                  padding: '0.85rem 0', borderBottom: '1px solid rgba(80,100,160,0.08)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
                }}>
                  <div>
                    <p style={{ fontSize: '0.83rem', color: '#0C1023' }}>{tx.description}</p>
                    <p style={{ fontSize: '0.7rem', color: '#68748E', marginTop: '0.15rem' }}>{tx.site_name || tx.site_key} · {formatDate(tx.created_at)}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    {tx.global_points > 0 && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', background: 'rgba(12,16,35,0.06)', color: '#0C1023' }}>+{tx.global_points} global</span>}
                    {tx.site_points > 0 && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', background: 'rgba(198,160,90,0.1)', color: '#A07830' }}>+{tx.site_points} site</span>}
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

          </>)}
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
            One account. Every world. Points that follow you everywhere.
          </p>

          {errorMsg && <p style={{ fontSize: '0.78rem', color: '#C04040', marginBottom: '0.75rem', textAlign: 'center' }}>{errorMsg}</p>}
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address" autoComplete="email"
              style={{ border: '1px solid rgba(80,100,160,0.25)', background: 'transparent', padding: '0.95rem 1.25rem', fontSize: '0.85rem', color: '#0C1023', outline: 'none', fontFamily: 'DM Sans, sans-serif', width: '100%', boxSizing: 'border-box' }} />
            {authMode !== 'forgot' && (
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                onKeyDown={e => e.key === 'Enter' && (authMode === 'signin' ? handleSignIn() : handleSignUp())}
                style={{ border: '1px solid rgba(80,100,160,0.25)', background: 'transparent', padding: '0.95rem 1.25rem', fontSize: '0.85rem', color: '#0C1023', outline: 'none', fontFamily: 'DM Sans, sans-serif', width: '100%', boxSizing: 'border-box' }} />
            )}
            <button
              disabled={status === 'loading'}
              onClick={authMode === 'signin' ? handleSignIn : authMode === 'signup' ? handleSignUp : handleForgot}
              style={{ background: '#0C1023', color: '#F5F7FC', border: 'none', padding: '0.95rem', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: status === 'loading' ? 'wait' : 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: status === 'loading' ? 0.7 : 1 }}>
              {status === 'loading' ? '…' : authMode === 'signin' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Email'}
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
              <button onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#68748E', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'DM Sans, sans-serif', padding: 0 }}>
                {authMode === 'signin' ? 'Create account →' : '← Sign in'}
              </button>
              {authMode === 'signin' && (
                <button onClick={() => { setAuthMode('forgot'); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: 'rgba(104,116,142,0.5)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'DM Sans, sans-serif', padding: 0 }}>
                  Forgot password?
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export function Footer() {
  return (
    <>
      <footer style={{
        borderTop: '1px solid rgba(80,100,160,0.15)',
        padding: '4rem 2.5rem 3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '2rem', maxWidth: '1400px', margin: '0 auto'
      }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, color: '#0C1023', marginBottom: '0.75rem' }}>
            Claude<span style={{ color: '#C6A05A' }}>Card</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#68748E', lineHeight: 1.7 }}>
            A world of food, hospitality, adventure, wellness, service, storytelling, and ridiculous creativity.
          </p>
        </div>
        <div>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '1.25rem' }}>Worlds</p>
          {worlds.map(w => (
            <a key={w} href="#worlds" style={{ display: 'block', fontSize: '0.82rem', color: '#68748E', textDecoration: 'none', marginBottom: '0.6rem' }}>{w}</a>
          ))}
        </div>
        <div>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '1.25rem' }}>Ecosystem</p>
          {ecosystem.map(e => (
            <a key={e} href={e === 'Rewards Circle' ? '/rewards' : e === 'About Claude' ? '/#about' : '/rewards'} style={{ display: 'block', fontSize: '0.82rem', color: '#68748E', textDecoration: 'none', marginBottom: '0.6rem' }}>{e}</a>
          ))}
        </div>
        <div>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '1.25rem' }}>Connect</p>
          <a href="mailto:claudecard710@gmail.com" style={{ display: 'block', fontSize: '0.82rem', color: '#68748E', textDecoration: 'none', marginBottom: '0.6rem' }}>Email Us</a>
        </div>
      </footer>
      <div style={{
        borderTop: '1px solid rgba(80,100,160,0.1)',
        textAlign: 'center', fontSize: '0.72rem',
        color: 'rgba(104,116,142,0.6)', letterSpacing: '0.08em',
        padding: '1.5rem 2.5rem'
      }}>
        © 2025 ClaudeCard.pro — All Rights Reserved
      </div>
    </>
  );
}
