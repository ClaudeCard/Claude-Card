export default function Hero() {
  return (
    <section className="hero-section" style={{
      minHeight: 'min(880px, 100vh)', display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end', padding: '8rem 2.5rem 6rem',
      position: 'relative', overflow: 'hidden', background: '#F5F7FC'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(110deg, rgba(245,247,252,0.98) 0%, rgba(245,247,252,0.88) 48%, rgba(245,247,252,0.45) 100%), radial-gradient(ellipse 70% 60% at 72% 28%, rgba(198,160,90,0.18), transparent 68%)',
        pointerEvents: 'none'
      }} />
      <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '1.5rem', position: 'relative' }}>
        ClaudeCard.pro — The Hub
      </p>

      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 'clamp(3.5rem, 8vw, 7.5rem)',
        fontWeight: 300, lineHeight: 1.05,
        color: '#0C1023', letterSpacing: '-0.01em',
        maxWidth: '820px', position: 'relative'
      }}>
        Chef. Creator.<br />
        Builder. <em style={{ fontStyle: 'italic', color: '#C6A05A' }}>Servant<br />of Love.</em>
      </h1>

      <p style={{
        fontSize: '1.05rem', color: '#68748E', maxWidth: '520px',
        margin: '2rem 0 3rem', lineHeight: 1.8, fontWeight: 300, position: 'relative'
      }}>
        A world of food, hospitality, adventure, wellness, service, storytelling, and ridiculous creativity.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', position: 'relative' }}>
        <a href="#worlds" className="btn-primary">Explore the Worlds</a>
      </div>

      <div className="hero-stats" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '1px',
        width: 'min(100%, 620px)',
        marginTop: '3rem',
        background: 'rgba(12,16,35,0.1)',
        position: 'relative'
      }}>
        {[
          ['07', 'Project worlds'],
          ['100', 'Starter points'],
          ['01', 'Shared circle']
        ].map(([value, label]) => (
          <div key={label} style={{ background: 'rgba(245,247,252,0.78)', padding: '1rem 1.15rem' }}>
            <strong style={{ display: 'block', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#0C1023', fontWeight: 400 }}>{value}</strong>
            <span style={{ display: 'block', marginTop: '0.2rem', fontSize: '0.66rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#68748E' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{
        position: 'absolute', bottom: '2.5rem', right: '2.5rem',
        fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#68748E', display: 'flex', alignItems: 'center', gap: '0.75rem'
      }}>
        <span style={{ display: 'block', width: '40px', height: '1px', background: 'rgba(198,160,90,0.35)' }} />
        Scroll
      </div>
    </section>
  );
}
