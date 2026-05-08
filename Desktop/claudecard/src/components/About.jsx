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
              <p style={{ fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0C1023', fontWeight: 500 }}>{role.title}</p>
              <p style={{ fontSize: '0.8rem', color: '#68748E', marginTop: '0.25rem' }}>{role.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{
          width: '100%', aspectRatio: '4/5',
          position: 'relative', overflow: 'hidden'
        }}>
          <img src="/claude.jpg" alt="Claude" style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block'
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(12,16,35,0.7))',
            padding: '2rem'
          }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontStyle: 'italic', color: '#F5F0E8', lineHeight: 1.5, marginBottom: '0.4rem' }}>
              "Food is the first<br />language of love."
            </p>
            <p style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(198,160,90,0.85)' }}>Est. 2011</p>
          </div>
        </div>
      </div>
    </section>
  );
}
