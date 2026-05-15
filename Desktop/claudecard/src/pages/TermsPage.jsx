import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service — ClaudeCard</title>
        <meta name="description" content="Terms and conditions for using ClaudeCard and its connected ecosystem." />
      </Helmet>
    <div style={{ fontFamily: 'DM Sans, system-ui, sans-serif', background: '#F5F7FC', minHeight: '100vh' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '8rem 2rem 4rem' }}>
        <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '0.75rem' }}>Legal</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#0C1023', marginBottom: '0.5rem' }}>Terms of Service</h1>
        <p style={{ color: '#68748E', fontSize: '0.85rem', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(80,100,160,0.12)' }}>Last updated: May 2026 · claudecard.pro</p>

        {[
          {
            title: '1. Acceptance',
            content: 'By using claudecard.pro or any ClaudeCard ecosystem site, you agree to these Terms of Service. If you do not agree, do not use the site.'
          },
          {
            title: '2. The Ridiculous Passport',
            content: 'The Ridiculous Passport is a shared identity system connecting ClaudeCard ecosystem sites. By creating a Passport account, you agree to these terms. You are responsible for keeping your credentials secure and for all activity under your account.'
          },
          {
            title: '3. Ecosystem Sites',
            content: 'ClaudeCard connects multiple independent brands including Granny Frannie\'s, Savvy Scuba, and SweetStone. Each site operates independently with its own products, services, and terms. ClaudeCard is responsible only for The Ridiculous Passport identity system, not for the products or services of individual ecosystem sites.'
          },
          {
            title: '4. Rewards & Points',
            content: 'The Ridiculous Passport tracks rewards points earned across ecosystem sites. Points have no cash value and cannot be exchanged for currency. We reserve the right to modify, suspend, or discontinue the rewards program at any time with reasonable notice.'
          },
          {
            title: '5. User Conduct',
            content: 'You agree not to create false accounts, misrepresent your identity, attempt to exploit the rewards system, or use the ecosystem for unlawful purposes.'
          },
          {
            title: '6. Intellectual Property',
            content: 'ClaudeCard and the names, logos, and content of all ecosystem sites are protected by intellectual property law. You may not reproduce or redistribute our content without written permission.'
          },
          {
            title: '7. Disclaimer',
            content: 'The platform is provided "as is." We do not warrant that the service will be uninterrupted or error-free.'
          },
          {
            title: '8. Limitation of Liability',
            content: 'To the maximum extent permitted by law, ClaudeCard\'s liability is limited to direct damages not to exceed $100.'
          },
          {
            title: '9. Governing Law',
            content: 'These Terms are governed by the laws of the State of Michigan, USA.'
          },
          {
            title: '10. Changes',
            content: 'We may update these Terms at any time. Continued use constitutes acceptance. Material changes will be communicated by email.'
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 500, color: '#0C1023', marginBottom: '0.75rem' }}>{section.title}</h2>
            <p style={{ color: '#68748E', lineHeight: 1.8 }}>{section.content}</p>
          </div>
        ))}

        <div style={{ borderTop: '1px solid rgba(80,100,160,0.12)', paddingTop: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ color: '#0C1023', fontSize: '0.85rem' }}>Privacy Policy</Link>
          <a href="mailto:claudecard710@gmail.com" style={{ color: '#0C1023', fontSize: '0.85rem' }}>Contact</a>
          <Link to="/" style={{ color: '#68748E', fontSize: '0.85rem' }}>← Back to ClaudeCard</Link>
        </div>
      </div>
    </div>
  </>
  );
}
