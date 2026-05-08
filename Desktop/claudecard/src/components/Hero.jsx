export default function Hero() {
  return (
    <section className="hero-section" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end', padding: '0 2.5rem 6rem',
      position: 'relative', overflow: 'hidden', background: '#F8F4EE'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 65% 30%, rgba(168,120,60,0.08), transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: '50%', right: '2.5rem',
        transform: 'translateY(-50%)',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '18vw', fontWeight: 300,
        color: 'rgba(160,112,64,0.04)',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none'
      }}>CC</div>

      <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#A07040', marginBottom: '1.5rem', position: 'relative' }}>
        ClaudeCard.com — The Hub
      </p>

      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 'clamp(3.5rem, 8vw, 7.5rem)',
        fontWeight: 300, lineHeight: 1.05,
        color: '#2B1A0E', letterSpacing: '-0.01em',
        maxWidth: '820px', position: 'relative'
      }}>
        Chef. Creator.<br />
        Builder. <em style={{ fontStyle: 'italic', color: '#A07040' }}>Servant<br />of Love.</em>
      </h1>

      <p style={{
        fontSize: '1.05rem', color: '#8B7355', maxWidth: '520px',
        margin: '2rem 0 3rem', lineHeight: 1.8, fontWeight: 300, position: 'relative'
      }}>
        A world of food, hospitality, adventure, wellness, service, storytelling, and ridiculous creativity.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', position: 'relative' }}>
        <a href="#worlds" className="btn-primary">Explore the Worlds</a>
        <a href="#circle" className="btn-outline">Join the Circle &ensp;+100 pts</a>
      </div>

      <div style={{
        position: 'absolute', bottom: '2.5rem', right: '2.5rem',
        fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#8B7355', display: 'flex', alignItems: 'center', gap: '0.75rem'
      }}>
        <span style={{ display: 'block', width: '40px', height: '1px', background: 'rgba(160,112,64,0.3)' }} />
        Scroll
      </div>
    </section>
  );
}
