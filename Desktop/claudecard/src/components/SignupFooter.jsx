import { useState } from 'react';
import { useInView } from '../hooks/useInView';

const worlds = ["Claude's Creations", "Granny Frannie's", 'Food Is Love', 'Love Is Love Meal Prep', 'SweetStone', "Claude's BBQ Club", 'Savvy Scuba'];
const ecosystem = ['Rewards Circle', 'About Claude', 'Events', 'Volunteer', 'Newsletter'];
const social = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Contact'];

export function Signup() {
  const [ref, inView] = useInView();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

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
        background: 'linear-gradient(180deg, transparent, rgba(232,213,176,0.6))'
      }} />

      <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#A07040', marginBottom: '1.5rem' }}>
        Join the Circle
      </p>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
        fontWeight: 300, lineHeight: 1.1, color: '#2B1A0E', marginBottom: '1.5rem'
      }}>
        Become part of<br />
        the <em style={{ fontStyle: 'italic', color: '#A07040' }}>ecosystem.</em>
      </h2>

      <p style={{ color: '#8B7355', fontSize: '0.92rem', lineHeight: 1.9, marginBottom: '3rem' }}>
        Early access, secret drops, events, recipes, and member rewards — delivered to you before anyone else.
      </p>

      {joined ? (
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontStyle: 'italic', color: '#A07040' }}>
          Welcome to the circle. ✦
        </p>
      ) : (
        <form onSubmit={e => { e.preventDefault(); if (email) setJoined(true); }}
          className="signup-form"
          style={{ display: 'flex', maxWidth: '480px', margin: '0 auto' }}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Your email address" required
            style={{
              flex: 1, border: '1px solid rgba(160,112,64,0.25)', borderRight: 'none',
              background: 'transparent', padding: '0.95rem 1.25rem',
              fontSize: '0.85rem', color: '#2B1A0E', outline: 'none',
              fontFamily: 'DM Sans, sans-serif'
            }}
          />
          <button type="submit" style={{
            background: '#2B1A0E', color: '#F8F4EE',
            border: '1px solid #2B1A0E', padding: '0.95rem 1.75rem',
            fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif'
          }}>Join +100 pts</button>
        </form>
      )}

      <p style={{ fontSize: '0.72rem', color: 'rgba(139,115,85,0.6)', marginTop: '1.25rem', letterSpacing: '0.05em' }}>
        No spam. Unsubscribe anytime. Your first 100 points are waiting.
      </p>
    </section>
  );
}

export function Footer() {
  return (
    <>
      <footer style={{
        borderTop: '1px solid rgba(160,112,64,0.15)',
        padding: '4rem 2.5rem 3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '2rem', maxWidth: '1400px', margin: '0 auto'
      }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 600, color: '#2B1A0E', marginBottom: '0.75rem' }}>
            Claude<span style={{ color: '#A07040' }}>Card</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#8B7355', lineHeight: 1.7 }}>
            A world of food, hospitality, adventure, wellness, service, storytelling, and ridiculous creativity.
          </p>
        </div>

        <div>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A07040', marginBottom: '1.25rem' }}>Worlds</p>
          {worlds.map(w => (
            <a key={w} href="#" style={{ display: 'block', fontSize: '0.82rem', color: '#8B7355', textDecoration: 'none', marginBottom: '0.6rem' }}>{w}</a>
          ))}
        </div>

        <div>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A07040', marginBottom: '1.25rem' }}>Ecosystem</p>
          {ecosystem.map(e => (
            <a key={e} href="#" style={{ display: 'block', fontSize: '0.82rem', color: '#8B7355', textDecoration: 'none', marginBottom: '0.6rem' }}>{e}</a>
          ))}
        </div>

        <div>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A07040', marginBottom: '1.25rem' }}>Connect</p>
          {social.map(s => (
            <a key={s} href="#" style={{ display: 'block', fontSize: '0.82rem', color: '#8B7355', textDecoration: 'none', marginBottom: '0.6rem' }}>{s}</a>
          ))}
        </div>
      </footer>

      <div style={{
        borderTop: '1px solid rgba(160,112,64,0.1)',
        textAlign: 'center', fontSize: '0.72rem',
        color: 'rgba(139,115,85,0.5)', letterSpacing: '0.08em',
        padding: '1.5rem 2.5rem'
      }}>
        © 2024 ClaudeCard.com — All Rights Reserved
      </div>
    </>
  );
}
