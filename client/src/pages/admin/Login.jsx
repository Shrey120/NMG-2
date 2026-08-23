import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { post } from '../../api.js';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Already signed in, so skip the form.
  if (localStorage.getItem('token')) return <Navigate to="/admin/home" replace />;

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const result = await post('/login', { email, password });
      // The token proves who we are. It is sent with every admin request.
      localStorage.setItem('token', result.token);
      localStorage.setItem('name', result.name);
      navigate('/admin/home');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: 24 }}>
          <span className="logo-mark">OA</span>
          <span className="logo-text">OUTLIER<small>AUTOWERKE</small></span>
        </Link>

        <form onSubmit={submit} className="card card-body stack">
          <h1 style={{ fontSize: '1.4rem' }}>Staff sign in</h1>

          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn btn-block">Sign in</button>

          <p className="form-note">
            Demo login: admin@outlierautowerke.com / admin1234
          </p>
        </form>

        <p className="center small" style={{ marginTop: 20 }}>
          <Link to="/">&larr; Back to website</Link>
        </p>
      </div>
    </div>
  );
}
