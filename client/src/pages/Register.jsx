import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../api.js';
import { saveSignIn } from '../auth.js';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', suburb: '' });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const result = await post('/register', { ...form, consent });
      saveSignIn(result);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page section" style={{ maxWidth: 560 }}>
      <h1>Create an account</h1>
      <p className="muted" style={{ marginTop: 8 }}>
        Customers do not need an account to browse, book a service or send an
        enquiry.
      </p>

      <form onSubmit={submit} className="card card-body stack" style={{ marginTop: 24 }}>
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" className="input" required value={form.name} onChange={update('name')} />
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" required value={form.email} onChange={update('email')} />
        </div>

        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" required minLength={8} value={form.password} onChange={update('password')} />
          <p className="form-note" style={{ marginTop: 6 }}>At least 8 characters.</p>
        </div>

        <div className="grid grid-2" style={{ gap: 14 }}>
          <div>
            <label className="label" htmlFor="phone">Phone (optional)</label>
            <input id="phone" className="input" value={form.phone} onChange={update('phone')} />
          </div>
          <div>
            <label className="label" htmlFor="suburb">Suburb (optional)</label>
            <input id="suburb" className="input" value={form.suburb} onChange={update('suburb')} />
          </div>
        </div>

        <label className="row small" style={{ gap: 10, flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
          <span>
            I have read and accept the <Link to="/privacy">privacy policy</Link> and{' '}
            <Link to="/terms">terms of use</Link>.
          </span>
        </label>

        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-block">
          Create customer account
        </button>

        <p className="small center">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
