const themes = {
  creations: { bg: '#B7151B', text: '#FFFFFF', tag: '#111111', arrow: { bg: '#111111', color: '#FFFFFF' } },
  granny:    { bg: '#1B2F6E', text: '#F5EFE8', tag: '#E8C87A', arrow: { bg: '#E8C87A', color: '#1B2F6E' } },
  foodlove:  { bg: '#F5F0E8', text: '#2B1A0E', tag: '#B04030', arrow: { bg: '#B04030', color: '#F5F0E8' } },
  foodislove:{ bg: '#F4F8EF', text: '#172315', tag: '#507A45', arrow: { bg: '#507A45', color: '#F4F8EF' } },
  loveislove:{ bg: '#EDE0D8', text: '#3A2820', tag: '#8B6050', arrow: { bg: '#8B6050', color: '#EDE0D8' } },
  sweetstone:{ bg: '#FFFFFF', text: '#10265F', tag: '#10265F', arrow: { bg: '#10265F', color: '#FFFFFF' } },
  bbq:       { bg: '#1C1008', text: '#F0E8D8', tag: '#D06030', arrow: { bg: '#D06030', color: '#1C1008' } },
  scuba:     { bg: '#041828', text: '#E0F0F8', tag: '#40B8D8', arrow: { bg: '#40B8D8', color: '#041828' } },
  menuplan:  { bg: '#FDFCFA', text: '#2C2C2C', tag: '#1A5F4A', arrow: { bg: '#1A5F4A', color: '#FFFFFF' } },
  spiritual: { bg: '#F2F0FF', text: '#24104F', tag: '#6E45D8', arrow: { bg: '#6E45D8', color: '#FFFFFF' } },
};

export default function ProjectCard({ project, index }) {
  const t = themes[project.theme] || themes.creations;
  const isExternal = project.href?.startsWith('http');
  const gridSpan = project.span === 3 ? 3 : 1;
  const isComingSoon = project.tag.includes('Coming Soon');

  return (
    <a
      className={gridSpan === 3 ? 'world-card world-card-full' : 'world-card'}
      href={project.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      aria-label={isExternal ? `Visit ${project.name}` : `Join the circle for ${project.name}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        color: 'inherit',
        textDecoration: 'none',
        display: 'block',
        minWidth: 0,
        gridColumn: `span ${gridSpan}`,
        transition: 'transform 0.25s ease'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.008)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div className="card-inner" style={{
        minHeight: '360px',
        height: '100%',
        background: t.bg, color: t.text,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '2rem', position: 'relative', overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 18px 42px rgba(12,16,35,0.08)',
        transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <span style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem',
            opacity: 0.58, fontWeight: 600
          }}>{String(index + 1).padStart(2, '0')}</span>

          <span aria-hidden="true" style={{
            width: '2.35rem', height: '2.35rem', borderRadius: '50%',
            background: t.arrow.bg, color: t.arrow.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 700
          }}>↗</span>
        </div>

        <div className="card-content" style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateRows: isComingSoon ? '3.4rem 4.7rem auto' : '2.4rem 4.7rem 5.5rem',
          alignItems: 'start',
          justifyItems: isComingSoon ? 'center' : 'start',
          textAlign: isComingSoon ? 'center' : 'left'
        }}>
          <span className={isComingSoon ? 'coming-soon-badge' : undefined} style={{
            fontSize: isComingSoon ? '1rem' : '0.66rem',
            letterSpacing: isComingSoon ? '0.2em' : '0.16em',
            textTransform: 'uppercase',
            color: t.tag,
            fontWeight: 800,
            lineHeight: 1.45
          }}>{project.tag}</span>

          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.9rem',
            fontWeight: 600, lineHeight: 1.08,
            margin: 0
          }}>{project.name}</h3>

          <p style={{
            fontSize: '0.82rem', lineHeight: 1.65, margin: 0,
            maxWidth: isComingSoon ? '640px' : '320px', opacity: 0.88, fontWeight: 500
          }}>{project.desc}</p>
        </div>
      </div>
    </a>
  );
}
