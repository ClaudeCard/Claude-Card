import { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient';

const worlds = ["Claude's Creations", "Granny Frannie's", 'Savvy Scuba', 'SweetStone', 'Food Is Love Meal Prep', "Claude's BBQ Club", 'MenuPlan Pro', 'Spiritual Clubhouse', 'Food Is Love Mobile Food Pantry'];
const ecosystem = ['Rewards Circle', 'About Claude', 'Events', 'Volunteer', 'Newsletter'];
const social = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Contact'];

export function Signup() {
  const [ref, inView] = useInView();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent | error
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setErrorMsg('');

    if (hasSupabaseConfig) {
      // Add to subscribers list (ignore duplicate)
      await supabase.from('subscribers').insert({
        email,
        site_key: import.meta.env.VITE_SITE_KEY || 'claudecard',
        site_name: import.meta.env.VITE_SITE_NAME || 'Claude Card',
      });

      // Send magic link to access passport
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.href },
      });

      if (error) {
        setErrorMsg(error.message);
        setStatus('error');
        return;
      }
    }

    setStatus('sent');
  }

  async function handleLogout() {
    if (hasSupabaseConfig) await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <section id="circle" ref={ref} className="circle-section" style={{
      padding: '8rem 2.5rem', textAlign: 'center',
      maxWidth: '680px', margin: '0 auto', position: 'relative',
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
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '1.5rem' }}>
            The Circle
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
            fontWeight: 300, lineHeight: 1.1, color: '#0C1023', marginBottom: '1.5rem'
          }}>
            Welcome back.
          </h2>
          <p style={{ color: '#68748E', fontSize: '0.92rem', lineHeight: 1.9, marginBottom: '2rem' }}>
            {user.email}
          </p>
          <button onClick={handleLogout} className="btn-outline" style={{ cursor: 'pointer', border: '1px solid rgba(12,16,35,0.22)' }}>
            Sign out
          </button>
        </>
      ) : (
        <>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '1.5rem' }}>
            Join the Circle
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
            fontWeight: 300, lineHeight: 1.1, color: '#0C1023', marginBottom: '1.5rem'
          }}>
            Become part of<br />
            the <em style={{ fontStyle: 'italic', color: '#C6A05A' }}>ecosystem.</em>
          </h2>
          <p style={{ color: '#68748E', fontSize: '0.92rem', lineHeight: 1.9, marginBottom: '3rem' }}>
            Early access, secret drops, events, recipes, and member rewards — delivered to you before anyone else.
          </p>

          {status === 'sent' ? (
            <p aria-live="polite" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontStyle: 'italic', color: '#C6A05A' }}>
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
                  autoComplete="email"
                  placeholder="Your email address" required
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
                <p style={{ fontSize: '0.78rem', color: '#C04040', marginTop: '0.75rem' }}>{errorMsg}</p>
              )}
              <p style={{ fontSize: '0.72rem', color: 'rgba(104,116,142,0.7)', marginTop: '1.25rem', letterSpacing: '0.05em' }}>
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
          {social.map(s => (
            <a key={s} href="#circle" style={{ display: 'block', fontSize: '0.82rem', color: '#68748E', textDecoration: 'none', marginBottom: '0.6rem' }}>{s}</a>
          ))}
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
