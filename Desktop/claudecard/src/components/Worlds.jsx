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
        marginBottom: '4rem', borderTop: '1px solid rgba(160,112,64,0.2)', paddingTop: '3rem'
      }}>
        <div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#A07040', marginBottom: '0.75rem' }}>
            Project Worlds
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 400, lineHeight: 1.1, color: '#2B1A0E'
          }}>
            Seven Worlds.<br />One Ecosystem.
          </h2>
        </div>
        <span className="worlds-header-num" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '4rem', fontWeight: 300,
          color: 'rgba(160,112,64,0.2)', lineHeight: 1
        }}>07</span>
      </div>

      <div className="worlds-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2px',
        background: 'rgba(160,112,64,0.12)'
      }}>
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
