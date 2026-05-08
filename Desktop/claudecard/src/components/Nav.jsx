import { useState, useEffect } from 'react';

const links = ['About', 'Worlds', 'Rewards', 'Circle'];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '1.25rem 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled || menuOpen ? 'rgba(245,247,252,0.97)' : 'transparent',
        backdropFilter: scrolled && !menuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled && !menuOpen ? '1px solid rgba(80,100,160,0.1)' : 'none',
        transition: 'all 0.3s'
      }}>
        <a href="#top" aria-label="ClaudeCard home" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', fontWeight: 600, color: '#0C1023', textDecoration: 'none' }}>
          Claude<span style={{ color: '#C6A05A' }}>Card</span>
        </a>

        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {links.map(label => (
            <a key={label} href={`#${label.toLowerCase()}`} style={{
              fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#68748E', textDecoration: 'none', transition: 'color 0.2s'
            }}>{label}</a>
          ))}
          <a href="#circle" style={{
            background: '#0C1023', color: '#F5F0E8',
            padding: '0.55rem 1.4rem', fontSize: '0.75rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
            transition: 'background 0.2s'
          }}>Join +100 pts</a>
        </div>

        <button className="nav-hamburger" onClick={() => setMenuOpen(m => !m)} aria-label="Menu" aria-expanded={menuOpen} aria-controls="mobile-menu">
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="3" y1="3" x2="17" y2="17" stroke="#0C1023" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="17" y1="3" x2="3" y2="17" stroke="#0C1023" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <line x1="0" y1="1" x2="22" y2="1" stroke="#0C1023" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0" y1="8" x2="22" y2="8" stroke="#0C1023" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0" y1="15" x2="22" y2="15" stroke="#0C1023" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" style={{
          position: 'fixed', inset: 0, background: '#F5F7FC', zIndex: 49,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '2.5rem'
        }}>
          {links.map(label => (
            <a key={label} href={`#${label.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Cormorant Garamond, serif', fontSize: '2.4rem',
                fontWeight: 400, color: '#0C1023', textDecoration: 'none',
                letterSpacing: '0.02em'
              }}
            >{label}</a>
          ))}
          <a href="#circle" onClick={() => setMenuOpen(false)} className="btn-primary"
            style={{ marginTop: '0.5rem' }}>
            Join +100 pts
          </a>
        </div>
      )}
    </>
  );
}
