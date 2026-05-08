const themes = {
  creations: { bg: '#0D0D0A', text: '#F0EBE0', tag: '#BFA060', arrow: { bg: '#BFA060', color: '#0D0D0A' } },
  granny:    { bg: '#1B2F6E', text: '#F5EFE8', tag: '#E8C87A', arrow: { bg: '#E8C87A', color: '#1B2F6E' } },
  foodlove:  { bg: '#F5F0E8', text: '#2B1A0E', tag: '#B04030', arrow: { bg: '#B04030', color: '#F5F0E8' } },
  loveislove:{ bg: '#EDE0D8', text: '#3A2820', tag: '#8B6050', arrow: { bg: '#8B6050', color: '#EDE0D8' } },
  sweetstone:{ bg: '#1A0D2E', text: '#E8DFF0', tag: '#BFA0E0', arrow: { bg: '#BFA0E0', color: '#1A0D2E' } },
  bbq:       { bg: '#1C1008', text: '#F0E8D8', tag: '#D06030', arrow: { bg: '#D06030', color: '#1C1008' } },
  scuba:     { bg: '#041828', text: '#E0F0F8', tag: '#40B8D8', arrow: { bg: '#40B8D8', color: '#041828' } },
};

export default function ProjectCard({ project, index }) {
  const t = themes[project.theme] || themes.creations;
  const isLarge = project.span === 2;

  return (
    <div style={{
      gridColumn: isLarge ? 'span 2' : 'span 1',
      position: 'relative', overflow: 'hidden', cursor: 'pointer'
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.008)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div className="card-inner" style={{
        height: isLarge ? '480px' : '380px',
        background: t.bg, color: t.text,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '2rem', position: 'relative', overflow: 'hidden',
        transition: 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)'
      }}>
        <span style={{
          position: 'absolute', top: '1.5rem', left: '1.5rem',
          fontFamily: 'Cormorant Garamond, serif', fontSize: '0.8rem',
          opacity: 0.4, zIndex: 1
        }}>{String(index + 1).padStart(2, '0')}</span>

        <span style={{
          fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: t.tag, marginBottom: '0.75rem', position: 'relative', zIndex: 1
        }}>{project.tag}</span>

        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: isLarge ? '2.2rem' : '1.7rem',
          fontWeight: 400, lineHeight: 1.1,
          position: 'relative', zIndex: 1
        }}>{project.name}</h3>

        <p style={{
          fontSize: '0.8rem', lineHeight: 1.7, marginTop: '0.6rem',
          position: 'relative', zIndex: 1, maxWidth: '320px', opacity: 0.8
        }}>{project.desc}</p>
      </div>
    </div>
  );
}
