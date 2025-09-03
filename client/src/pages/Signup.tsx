import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import GoogleButton from '../components/GoogleButton';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await api.auth.requestOtp(name, email, dob);
      nav('/verify-otp', { state: { email } });
    } catch (e:any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="container">
      <div className="card" role="main">
        <div className="brand">Notely</div>
        <h2 className="h1">Create your account</h2>
        <p className="sub">Sign up to get access to your notes</p>
        <form className="form" onSubmit={onSubmit}>
          <div>
            <label>Your Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Jonas Khanwald" required minLength={2} />
          </div>
          <div>
            <label>Date of Birth</label>
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)} />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jonas_kahnwald@gmail.com" required />
          </div>
          <button disabled={loading}>{loading ? 'Sending OTP...' : 'Get OTP'}</button>
        </form>
        {error && <div className="footer" style={{color:'var(--danger)'}}>{error}</div>}
        <div style={{marginTop:12}}><GoogleButton remember={true} /></div>
        <div className="footer">Already have an account? <Link className="link" to="/signin">Sign in</Link></div>
      </div>
    </div>
  );
}
