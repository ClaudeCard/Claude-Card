import { useInView } from '../hooks/useInView';
import { rewardTiers, earnWays } from '../data/projects';

export default function Rewards() {
  const [ref, inView] = useInView();

  return (
    <section id="rewards" ref={ref} className="rewards-section" style={{
      background: '#2B1A0E', color: '#F8F4EE',
      padding: '8rem 2.5rem', overflow: 'hidden', position: 'relative',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'all 0.9s ease'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(160,112,64,0.08), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="rewards-inner" style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '8rem', alignItems: 'start', position: 'relative'
      }}>
        <div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C89860', marginBottom: '1.5rem' }}>
            Cross-Brand Ecosystem
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 300, lineHeight: 1.1, color: '#F8F4EE'
          }}>
            One Circle.<br />
            <em style={{ fontStyle: 'italic', color: '#C89860' }}>Every World.</em>
          </h2>
          <p style={{ color: 'rgba(232,208,176,0.65)', fontSize: '0.92rem', lineHeight: 1.9, marginTop: '1.5rem', maxWidth: '380px' }}>
            Every interaction across the ClaudeCard ecosystem earns you points. Every purchase, every volunteer shift, every referral, every membership — woven together into a single living reward.
          </p>

          <div style={{ marginTop: '3rem' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,168,96,0.7)', marginBottom: '1.25rem' }}>
              Ways to earn
            </p>
            {earnWays.map(way => (
              <div key={way} style={{
                padding: '0.6rem 0', borderBottom: '1px solid rgba(160,112,64,0.15)',
                fontSize: '0.83rem', color: 'rgba(232,208,176,0.75)',
                display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#A07040', flexShrink: 0 }} />
                {way}
              </div>
            ))}
          </div>
        </div>

        <div>
          {rewardTiers.map((tier, i) => (
            <div key={tier.id} style={{
              border: '1px solid rgba(160,112,64,0.15)',
              padding: '2rem 2.5rem', position: 'relative',
              marginBottom: '-1px', transition: 'all 0.3s', cursor: 'default'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,112,64,0.06)'; e.currentTarget.style.borderColor = 'rgba(160,112,64,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(160,112,64,0.15)'; }}
            >
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                background: `rgba(160,112,64,${0.25 + i * 0.2})`
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#F8F4EE' }}>{tier.name}</span>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C89860' }}>{tier.pts}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(232,208,176,0.55)', lineHeight: 1.6 }}>{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
