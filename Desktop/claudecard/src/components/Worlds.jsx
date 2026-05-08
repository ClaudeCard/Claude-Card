import { useInView } from '../hooks/useInView';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';

export default function Worlds() {
  const [ref, inView] = useInView();

  return (
    <section id="worlds" ref={ref} className="worlds-section" style={{
      padding: '5rem 2.5rem 8rem',
      maxWidth: '1400px', margin: '0 auto',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'all 0.9s ease'
    }}>
      <div className="worlds-header" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: '4rem', borderTop: '1px solid rgba(80,100,160,0.2)', paddingTop: '3rem'
      }}>
        <div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3D63B8', marginBottom: '0.75rem' }}>
            Project Worlds
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 400, lineHeight: 1.1, color: '#0C1023'
          }}>
            Nine Worlds.<br />One Ecosystem.
          </h2>
        </div>
        <span className="worlds-header-num" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '4rem', fontWeight: 300,
          color: 'rgba(61,99,184,0.18)', lineHeight: 1
        }}>09</span>
      </div>

      <div className="worlds-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '1rem'
      }}>
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
