import { useInView } from '../hooks/useInView';
import { roles } from '../data/projects';

export default function About() {
  const [ref, inView] = useInView();

  return (
    <section id="about" ref={ref} className="about-section" style={{
      padding: '8rem 2.5rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '6rem',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'all 0.9s ease'
    }}>
      <div>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3D63B8', marginBottom: '1.5rem' }}>
          The Person Behind It All
        </p>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
          fontWeight: 400, lineHeight: 1.15, color: '#0C1023'
        }}>
          Not just a chef.<br />
          <em style={{ fontStyle: 'italic', color: '#3D63B8' }}>A whole world</em><br />
          of possibility.
        </h2>
        <p style={{ color: '#68748E', fontSize: '0.97rem', lineHeight: 1.9, marginTop: '1.5rem', fontWeight: 300 }}>
          Claude isn't defined by a single lane. He moves between kitchens and coral reefs, building tables where everyone eats — in every sense of the word. Driven by love for people, food, and the stories that connect them, he's built an ecosystem that feels like a community, not a brand.
        </p>
        <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {roles.map(role => (
            <div key={role.num} style={{ padding: '1.25rem', border: '1px solid rgba(80,100,160,0.16)', background: 'rgba(255,255,255,0.5)' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.78rem', color: '#3D63B8', marginBottom: '0.5rem' }}>{role.num}</p>
              <p style={{ fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0C1023', fontWeight: 500 }}>{role.title}</p>
              <p style={{ fontSize: '0.8rem', color: '#68748E', marginTop: '0.25rem' }}>{role.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{
          width: '100%', aspectRatio: '4/5',
          background: 'linear-gradient(145deg, #EDF2FF, rgba(61,99,184,0.12))',
          border: '1px solid rgba(80,100,160,0.24)',
          display: 'flex', alignItems: 'flex-end', padding: '2rem', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(61,99,184,0.12), transparent)' }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontStyle: 'italic', color: '#3D63B8', position: 'relative', lineHeight: 1.5 }}>
            "Food is the first<br />language of love."
          </p>
        </div>
        <div className="about-est-badge" style={{
          position: 'absolute', top: '1.5rem', right: '-1.5rem',
          background: '#0C1023', color: '#F5F7FC',
          padding: '1rem 0.75rem', fontSize: '0.7rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          writingMode: 'vertical-rl'
        }}>Est. 2024</div>
      </div>
    </section>
  );
}
