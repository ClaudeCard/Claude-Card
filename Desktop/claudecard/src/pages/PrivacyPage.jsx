import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — ClaudeCard</title>
        <meta name="description" content="How ClaudeCard collects, uses, and protects your information." />
      </Helmet>
    <div style={{ fontFamily: 'DM Sans, system-ui, sans-serif', background: '#F5F7FC', minHeight: '100vh' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '8rem 2rem 4rem' }}>
        <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C6A05A', marginBottom: '0.75rem' }}>Legal</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#0C1023', marginBottom: '0.5rem' }}>Privacy Policy</h1>
        <p style={{ color: '#68748E', fontSize: '0.85rem', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(80,100,160,0.12)' }}>Last updated: May 2026 · claudecard.pro</p>

        {[
          {
            title: '1. Who We Are',
            content: <p>ClaudeCard ("we," "us," "our") is the central hub of a connected lifestyle ecosystem operating at claudecard.pro. ClaudeCard operates The Ridiculous Passport — a shared identity system connecting claudecard.pro, grannyfrannies.com, savvyscuba.com, sweetstone.com, and future ecosystem sites. Contact: <a href="mailto:claudecard710@gmail.com" style={{ color: '#0C1023' }}>claudecard710@gmail.com</a></p>
          },
          {
            title: '2. The Ridiculous Passport',
            content: <p>The Ridiculous Passport is our shared authentication and identity system. When you create a Passport account, your identity (email address, user ID, basic profile) is shared across participating ClaudeCard ecosystem sites. Each site maintains its own reward points, preferences, and membership status. Passwords are hashed and never stored in plain text. Authentication is managed via Supabase using industry-standard security.</p>
          },
          {
            title: '3. Information We Collect',
            content: <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
              <li><strong>Account data:</strong> Email, hashed password, display name</li>
              <li><strong>Reward data:</strong> Points earned, site memberships, tier status, transaction history</li>
              <li><strong>Profile data:</strong> Preferences and settings you choose to share</li>
              <li><strong>Usage data:</strong> Pages visited, actions taken (anonymous analytics)</li>
              <li><strong>Communications:</strong> Messages submitted through contact forms</li>
            </ul>
          },
          {
            title: '4. How We Use Your Information',
            content: <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
              <li>To operate The Ridiculous Passport across the ecosystem</li>
              <li>To track and display your unified rewards balance</li>
              <li>To communicate about your account and ecosystem activity</li>
              <li>To improve sites and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          },
          {
            title: '5. Data Sharing',
            content: <p>We do not sell your data. We share your identity (email/user ID) across ClaudeCard ecosystem sites through The Ridiculous Passport so you experience a unified login. Each site handles its own products and transactions independently. We use Supabase for data storage and authentication.</p>
          },
          {
            title: '6. Cookies & Sessions',
            content: <p>We use session cookies required for authentication. These expire after inactivity. We do not use third-party advertising cookies.</p>
          },
          {
            title: '7. Your Rights',
            content: <p>You may request access, correction, or deletion of your data at any time. Email <a href="mailto:claudecard710@gmail.com" style={{ color: '#0C1023' }}>claudecard710@gmail.com</a>. Account deletion will remove your identity from the ecosystem, though individual sites may retain transaction records as required by law.</p>
          },
          {
            title: '8. Data Retention',
            content: <p>Account data is retained while your account is active. You may request deletion at any time. Transaction records may be retained for up to seven years for legal purposes.</p>
          },
          {
            title: '9. Security',
            content: <p>We implement industry-standard security measures including encrypted connections (HTTPS), hashed passwords, access controls, and audit logging. No system is perfectly secure, and we encourage you to use a strong, unique password.</p>
          },
          {
            title: '10. Changes',
            content: <p>We may update this policy periodically. We will notify you of material changes via email. Continued use of the site constitutes acceptance.</p>
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 500, color: '#0C1023', marginBottom: '0.75rem' }}>{section.title}</h2>
            <div style={{ color: '#68748E', lineHeight: 1.8 }}>{section.content}</div>
          </div>
        ))}

        <div style={{ borderTop: '1px solid rgba(80,100,160,0.12)', paddingTop: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ color: '#0C1023', fontSize: '0.85rem' }}>Terms of Service</Link>
          <a href="mailto:claudecard710@gmail.com" style={{ color: '#0C1023', fontSize: '0.85rem' }}>Contact</a>
          <Link to="/" style={{ color: '#68748E', fontSize: '0.85rem' }}>← Back to ClaudeCard</Link>
        </div>
      </div>
    </div>
  </>
  );
}
