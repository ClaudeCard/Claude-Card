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

      <div>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontStyle: 'italic', color: '#C6A05A', lineHeight: 1.5, marginBottom: '1rem' }}>
          "Food is the first<br />language of love."
        </p>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#68748E' }}>Est. 2011</p>
      </div>
    </section>
  );
}
