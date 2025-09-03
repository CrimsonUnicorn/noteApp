import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const data = await api.auth.verifyOtp(email, otp, remember);
      localStorage.setItem('access', data.accessToken);
      nav('/app');
    } catch (err:any) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function resendOtp() {
    try {
      await api.auth.requestOtp('User', email);
      alert('OTP resent');
    } catch (e:any) { setError(e.message); }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="brand">Notely</div>
        <h2 className="h1">Sign in to your account</h2>
        <p className="sub">Enter your email and the OTP we send</p>
        <form className="form" onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jonas_kahnwald@gmail.com" required />
          </div>
          <div>
            <label>OTP</label>
            <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="6-digit OTP" minLength={6} maxLength={6} />
          </div>
          <div className="checkbox">
            <input id="remember" type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
            <label htmlFor="remember">Keep me logged in</label>
          </div>
          <button disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div style={{marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button className="link" onClick={resendOtp} style={{border:'none',background:'transparent',padding:0}}>Resend OTP</button>
          <Link className="link" to="/signup">Create account</Link>
        </div>
        {error && <div className="footer" style={{color:'var(--danger)'}}>{error}</div>}
      </div>
    </div>
  );
}
