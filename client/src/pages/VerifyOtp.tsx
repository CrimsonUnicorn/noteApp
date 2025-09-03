import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';

export default function VerifyOtp() {
  const loc = useLocation() as any;
  const email = loc.state?.email || '';
  const [otp, setOtp] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const data = await api.auth.verifyOtp(email, otp, remember);
      localStorage.setItem('access', data.accessToken);
      nav('/app');
    } catch (e:any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="brand">Notely</div>
        <h2 className="h1">Verify OTP</h2>
        <p className="sub">We sent an OTP to <b>{email}</b></p>
        <form className="form" onSubmit={onSubmit}>
          <div>
            <label>OTP</label>
            <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="6-digit OTP" minLength={6} maxLength={6} />
          </div>
          <div className="checkbox">
            <input id="remember" type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
            <label htmlFor="remember">Keep me logged in</label>
          </div>
          <button disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
        </form>
        {error && <div className="footer" style={{color:'var(--danger)'}}>{error}</div>}
      </div>
    </div>
  );
}
