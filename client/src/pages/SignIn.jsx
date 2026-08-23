import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../api.js';
import { saveSignIn } from '../auth.js';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const result = await post('/login', { email, password });
      saveSignIn(result);
      // Staff go to the admin panel, customers go to their own area.
      navigate(result.role === 'CUSTOMER' ? '/account' : '/admin/home');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page section" style={{ maxWidth: 460 }}>
      <h1>Sign in</h1>
      <p className="muted" style={{ marginTop: 8 }}>
        Customers sign in to make swap offers and post wanted ads. Staff sign in
        to manage the site.
      </p>

      <form onSubmit={submit} className="card card-body stack" style={{ marginTop: 24 }}>
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

        <p className="small center">
          No account? <Link to="/register">Create one</Link>
        </p>

        <p className="form-note">
          Demo accounts - admin@outlierautowerke.com / admin1234,
          staff@outlierautowerke.com / staff1234,
          daniel@example.com / customer1234
        </p>
      </form>
    </div>
  );
}
