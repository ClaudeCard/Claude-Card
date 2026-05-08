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
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [membership, setMembership] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingPassport, setLoadingPassport] = useState(false);

  const loadPassport = useCallback(async (activeUser) => {
    if (!activeUser || !hasSupabaseConfig) return;
    setLoadingPassport(true);

    await supabase.rpc('join_site_membership', { p_site_key: siteKey, p_site_name: siteName });

    const [p, m, t] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', activeUser.id).single(),
      supabase.from('site_memberships').select('*').eq('user_id', activeUser.id).eq('site_key', siteKey).single(),
      supabase.from('reward_transactions').select('*').eq('user_id', activeUser.id).order('created_at', { ascending: false }).limit(5),
    ]);

    setProfile(p.data ?? null);
    setMembership(m.data ?? null);
    setTransactions(t.data ?? []);
    setLoadingPassport(false);
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) loadPassport(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadPassport(u);
      else { setProfile(null); setMembership(null); setTransactions([]); }
    });
    return () => listener.subscription.unsubscribe();
  }, [loadPassport]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setErrorMsg('');
    if (hasSupabaseConfig) {
      await supabase.from('subscribers').insert({ email, site_key: siteKey, site_name: siteName });
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.href },
      });
      if (error) { setErrorMsg(error.message); setStatus('error'); return; }
    }
    setStatus('sent');
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

          {status === 'sent' ? (
            <p aria-live="polite" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontStyle: 'italic', color: '#C6A05A', textAlign: 'center' }}>
              Check your email — your link is waiting. ✦
            </p>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="signup-form"
                style={{ display: 'flex', maxWidth: '480px', margin: '0 auto' }}>
                <label htmlFor="circle-email" className="sr-only">Email address</label>
                <input
                  id="circle-email"
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  autoComplete="email" placeholder="Your email address" required
                  style={{
                    flex: 1, border: '1px solid rgba(80,100,160,0.25)', borderRight: 'none',
                    background: 'transparent', padding: '0.95rem 1.25rem',
                    fontSize: '0.85rem', color: '#0C1023', outline: 'none',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                />
                <button type="submit" disabled={status === 'loading'} style={{
                  background: '#0C1023', color: '#F5F7FC',
                  border: '1px solid #0C1023', padding: '0.95rem 1.75rem',
                  fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: status === 'loading' ? 'wait' : 'pointer', whiteSpace: 'nowrap',
                  fontFamily: 'DM Sans, sans-serif', opacity: status === 'loading' ? 0.7 : 1
                }}>{status === 'loading' ? '...' : 'Join +100 pts'}</button>
              </form>
              {status === 'error' && (
                <p style={{ fontSize: '0.78rem', color: '#C04040', marginTop: '0.75rem', textAlign: 'center' }}>{errorMsg}</p>
              )}
              <p style={{ fontSize: '0.72rem', color: 'rgba(104,116,142,0.7)', marginTop: '1.25rem', letterSpacing: '0.05em', textAlign: 'center' }}>
                New or returning — one email gets you in.
              </p>
            </>
          )}
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
            <a key={e} href={e === 'Rewards Circle' ? '#circle' : e === 'About Claude' ? '#about' : '#circle'} style={{ display: 'block', fontSize: '0.82rem', color: '#68748E', textDecoration: 'none', marginBottom: '0.6rem' }}>{e}</a>
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
