import { useEffect, useState } from 'react';

const FUNCTIONS_URL = 'https://btnqffnhxvixpenspmgz.supabase.co/functions/v1';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('Signing you in…');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get('sso');

    if (!ssoToken) {
      window.location.replace('/rewards');
      return;
    }

    async function exchange() {
      try {
        const res = await fetch(`${FUNCTIONS_URL}/sso-exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: ssoToken }),
        });

        if (res.ok) {
          const { magic_url } = await res.json();
          window.location.replace(magic_url);
        } else {
          setStatus('Link expired — redirecting…');
          setTimeout(() => window.location.replace('/rewards'), 1500);
        }
      } catch {
        setStatus('Something went wrong — redirecting…');
        setTimeout(() => window.location.replace('/rewards'), 1500);
      }
    }

    exchange();
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#F5F7FC',
      fontFamily: 'DM Sans, system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600, color: '#0C1023', marginBottom: '1rem' }}>
          Claude<span style={{ color: '#C6A05A' }}>Card</span>
        </div>
        <p style={{ color: '#68748E', fontSize: '0.88rem' }}>{status}</p>
      </div>
    </div>
  );
}
