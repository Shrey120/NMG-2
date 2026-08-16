import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { api } from '../../api.js';
import { Button } from '../../components/ui.jsx';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (localStorage.getItem('oa_token')) return <Navigate to="/admin/dashboard" replace />;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { token, user } = await api.login(email, password);
      localStorage.setItem('oa_token', token);
      localStorage.setItem('oa_user', JSON.stringify(user));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  function fillDemo() {
    setEmail('admin@outlierautowerke.example');
    setPassword('prototype');
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded bg-accent font-mono text-sm font-black text-ink">
            OA
          </span>
          <span className="leading-none">
            <span className="block text-sm font-bold tracking-wide">OUTLIER</span>
            <span className="block text-[10px] tracking-[0.2em] text-muted">AUTOWERKE</span>
          </span>
        </Link>

        <form onSubmit={submit} className="panel space-y-4 p-7">
          <div>
            <h1 className="text-xl font-bold">Staff sign in</h1>
            <p className="mt-1 text-sm text-muted">Admin panel for managing site content.</p>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Email</span>
            <input
              className="field"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Password</span>
            <input
              className="field"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>

          <div className="rounded-lg border border-accent/25 bg-accent/5 p-3 text-xs">
            <p className="font-semibold text-accent">Prototype credentials</p>
            <p className="mt-1 font-mono text-[11px] text-muted">
              admin@outlierautowerke.example
              <br />
              prototype
            </p>
            <button type="button" onClick={fillDemo} className="mt-2 text-accent underline underline-offset-2">
              Fill automatically
            </button>
          </div>
        </form>

        <Link to="/" className="mt-6 block text-center text-sm text-muted hover:text-accent">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
