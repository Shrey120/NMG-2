import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import { post } from '../api.js';
import { isSignedIn } from '../auth.js';
import Loading from '../components/Loading.jsx';

function OfferForm({ exchangeId }) {
  const [form, setForm] = useState({ offering: '', cashAdjustment: '0', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await post(`/exchanges/${exchangeId}/offers`, form);
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (sent) {
    return (
      <div className="card card-body center">
        <h3>Offer sent</h3>
        <p className="small muted" style={{ marginTop: 8 }}>
          The workshop will reply in the conversation on your account page.
        </p>
        <Link to="/account" className="btn btn-outline" style={{ marginTop: 16 }}>
          Go to my offers
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card card-body stack">
      <h3>Offer a swap</h3>

      <div>
        <label className="label" htmlFor="offering">What are you offering?</label>
        <textarea id="offering" className="input" required value={form.offering} onChange={update('offering')} />
      </div>

      <div>
        <label className="label" htmlFor="cash">Cash adjustment</label>
        <input id="cash" type="number" step="10" className="input" value={form.cashAdjustment} onChange={update('cashAdjustment')} />
        <p className="form-note" style={{ marginTop: 6 }}>
          A positive number means you add cash on top. A negative number means
          you want cash back. Leave it at 0 for a straight swap.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="message">Message (optional)</label>
        <textarea id="message" className="input" value={form.message} onChange={update('message')} />
      </div>

      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn btn-block">Send offer</button>
    </form>
  );
}

export default function ExchangeItem() {
  const { id } = useParams();
  const { data: item, loading } = useLoad(`/exchanges/${id}`);

  if (loading) return <Loading />;

  if (!item) {
    return (
      <div className="page section">
        <div className="empty">
          <h2>Exchange item not found</h2>
          <Link to="/exchange" className="btn btn-outline" style={{ marginTop: 20 }}>Back to exchange</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page section">
      <Link to="/exchange" className="small">&larr; Back to exchange</Link>

      <div className="with-form" style={{ marginTop: 24 }}>
        <div>
          <div className="row" style={{ gap: 8 }}>
            {item.make && <span className="badge">{item.make}</span>}
            <span className="badge badge-quiet">{item.status}</span>
          </div>

          <h1 style={{ fontSize: '2rem', marginTop: 14 }}>{item.title}</h1>

          <div className="swap" style={{ marginTop: 24 }}>
            <div className="swap-box">
              <p className="eyebrow">We have</p>
              <p style={{ marginTop: 8 }}>{item.offering}</p>
            </div>
            <div className="swap-arrow">&#8644;</div>
            <div className="swap-box">
              <p className="eyebrow">We want</p>
              <p style={{ marginTop: 8 }}>{item.wanting}</p>
            </div>
          </div>

          {item.description && (
            <>
              <h2 style={{ fontSize: '1.2rem', marginTop: 32 }}>Details</h2>
              <p style={{ marginTop: 10 }}>{item.description}</p>
            </>
          )}
        </div>

        {isSignedIn() ? (
          <OfferForm exchangeId={item.id} />
        ) : (
          <div className="card card-body center">
            <h3>Sign in to make an offer</h3>
            <p className="small muted" style={{ marginTop: 8 }}>
              Swap offers need an account so we have a way to reply to you.
            </p>
            <div className="stack" style={{ marginTop: 16 }}>
              <Link to="/signin" className="btn btn-block">Sign in</Link>
              <Link to="/register" className="btn btn-outline btn-block">Create an account</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
