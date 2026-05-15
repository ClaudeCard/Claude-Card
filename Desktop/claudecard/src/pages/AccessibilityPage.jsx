import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function AccessibilityPage() {
  return (
    <>
      <Helmet>
        <title>Accessibility — ClaudeCard</title>
        <meta name="description" content="ClaudeCard's accessibility commitment and how to reach us with accessibility concerns." />
      </Helmet>
    <div style={{ fontFamily: 'DM Sans, system-ui, sans-serif', background: '#F5F7FC', minHeight: '100vh' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '8rem 2rem 4rem' }}>
        <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '0.75rem' }}>Legal</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#0C1023', marginBottom: '0.5rem' }}>Accessibility Statement</h1>
        <p style={{ color: '#68748E', fontSize: '0.85rem', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(80,100,160,0.12)' }}>Last updated: May 2026 · claudecard.pro</p>

        {[
          {
            title: 'Our Commitment',
            body: 'ClaudeCard is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.'
          },
          {
            title: 'Conformance Status',
            body: 'We aim for conformance with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with disabilities.'
          },
          {
            title: 'Technical Specifications',
            body: 'ClaudeCard.pro relies on the following technologies for conformance: HTML, CSS, JavaScript, WAI-ARIA. The site uses semantic HTML elements, proper heading hierarchy, ARIA labels where needed, and visible focus states for keyboard navigation.'
          },
          {
            title: 'Known Limitations',
            body: 'We are actively working to improve accessibility. Some areas under active improvement include: complex data tables in the rewards dashboard, dynamic content updates in the passport panel, and third-party embedded content (Stripe checkout). We aim to address these on an ongoing basis.'
          },
          {
            title: 'Feedback',
            body: 'We welcome feedback on accessibility. If you experience barriers or have suggestions for improvement, please contact us at claudecard710@gmail.com. We aim to respond within 3 business days.'
          },
          {
            title: 'Formal Complaints',
            body: 'If you are not satisfied with our response, you may contact the relevant national accessibility authority in your country.'
          },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 500, color: '#0C1023', marginBottom: '0.75rem' }}>{s.title}</h2>
            <p style={{ color: '#68748E', lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}

        <div style={{ borderTop: '1px solid rgba(80,100,160,0.12)', paddingTop: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a href="mailto:claudecard710@gmail.com" style={{ color: '#0C1023', fontSize: '0.85rem' }}>Report an issue</a>
          <Link to="/privacy" style={{ color: '#68748E', fontSize: '0.85rem' }}>Privacy Policy</Link>
          <Link to="/" style={{ color: '#68748E', fontSize: '0.85rem' }}>← Home</Link>
        </div>
      </div>
    </div>
  </>
  );
}
