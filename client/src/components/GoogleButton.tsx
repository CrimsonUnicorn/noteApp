import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function GoogleButton({ remember }: { remember: boolean }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // @ts-ignore
    if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response:any) => {
          try {
            const data = await api.auth.google(response.credential, remember);
            localStorage.setItem('access', data.accessToken);
            window.location.href = '/app';
          } catch (e:any) { setError(e.message); }
        }
      });
      // @ts-ignore
      google.accounts.id.renderButton(document.getElementById('google-btn'), { theme:'outline', size:'large' });
    }
  }, [remember]);

  return (
    <div style={{ marginTop: 8 }}>
      <div id="google-btn"></div>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  );
}
