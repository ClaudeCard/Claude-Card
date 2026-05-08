import { useInView } from '../hooks/useInView';
import { rewardTiers, earnWays } from '../data/projects';

export default function Rewards() {
  const [ref, inView] = useInView();

  return (
    <section id="rewards" ref={ref} className="rewards-section" style={{
      background: '#081633', color: '#F5F7FC',
      padding: '8rem 2.5rem', overflow: 'hidden', position: 'relative',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'all 0.9s ease'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(83,124,220,0.18), transparent)',
        pointerEvents: 'none'
      }} />

      <div className="rewards-inner" style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '8rem', alignItems: 'start', position: 'relative'
      }}>
        <div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9FB9FF', marginBottom: '1.5rem' }}>
            Cross-Brand Ecosystem
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 300, lineHeight: 1.1, color: '#F5F7FC'
          }}>
            One Circle.<br />
            <em style={{ fontStyle: 'italic', color: '#9FB9FF' }}>Every World.</em>
          </h2>
          <p style={{ color: 'rgba(220,228,255,0.7)', fontSize: '0.92rem', lineHeight: 1.9, marginTop: '1.5rem', maxWidth: '380px' }}>
            Every interaction across the ClaudeCard ecosystem earns you points. Every purchase, every volunteer shift, every referral, every membership — woven together into a single living reward.
          </p>

          <div style={{ marginTop: '3rem' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(159,185,255,0.75)', marginBottom: '1.25rem' }}>
              Ways to earn
            </p>
            {earnWays.map(way => (
              <div key={way} style={{
                padding: '0.6rem 0', borderBottom: '1px solid rgba(159,185,255,0.16)',
                fontSize: '0.83rem', color: 'rgba(220,228,255,0.78)',
                display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#9FB9FF', flexShrink: 0 }} />
                {way}
              </div>
            ))}
          </div>
        </div>

        <div>
          {rewardTiers.map((tier, i) => (
            <div key={tier.id} style={{
              border: '1px solid rgba(159,185,255,0.16)',
              padding: '2rem 2.5rem', position: 'relative',
              marginBottom: '-1px', transition: 'all 0.3s', cursor: 'default'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(83,124,220,0.12)'; e.currentTarget.style.borderColor = 'rgba(159,185,255,0.38)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(159,185,255,0.16)'; }}
            >
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                background: `rgba(159,185,255,${0.25 + i * 0.16})`
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#F5F7FC' }}>{tier.name}</span>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9FB9FF' }}>{tier.pts}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(220,228,255,0.58)', lineHeight: 1.6 }}>{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
