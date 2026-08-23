import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import { post } from '../api.js';
import { isSignedIn } from '../auth.js';
import Loading from '../components/Loading.jsx';

function PostForm({ onPosted }) {
  const [form, setForm] = useState({ title: '', make: '', budget: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await post('/wanted', form);
      setForm({ title: '', make: '', budget: '', description: '' });
      setPosted(true);
      onPosted();
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  if (posted) {
    return (
      <div className="card card-body center">
        <h3>Posted</h3>
        <p className="small muted" style={{ marginTop: 8 }}>
          The workshop checks new wanted ads before they appear publicly, so it
          will not show in the list straight away.
        </p>
        <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => setPosted(false)}>
          Post another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card card-body stack">
      <h3>Post what you need</h3>
      <input className="input" placeholder="Part you are after" required value={form.title} onChange={update('title')} aria-label="Part you are after" />
      <input className="input" placeholder="Marque" value={form.make} onChange={update('make')} aria-label="Marque" />
      <input className="input" placeholder="Budget" value={form.budget} onChange={update('budget')} aria-label="Budget" />
      <textarea className="input" placeholder="Details, fitment, how far you will travel" required value={form.description} onChange={update('description')} aria-label="Details" />
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn btn-block" disabled={saving}>
        {saving ? 'Posting...' : 'Post wanted ad'}
      </button>
      <p className="form-note">Checked by the workshop before it appears publicly.</p>
    </form>
  );
}

export default function Wanted() {
  const { data, loading, reload } = useLoad('/wanted');

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Parts Wanted</p>
          <h1 style={{ marginTop: 12 }}>Chasing something specific?</h1>
          <p className="muted" style={{ marginTop: 12, maxWidth: 620 }}>
            Wanted ads from the workshop and from customers. If we spot what you
            are after through our supplier network, we will let you know.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <div className="with-form">
            <div className="stack">
              {loading ? (
                <Loading />
              ) : (
                (data || []).map((item) => (
                  <article key={item.id} className="card card-hover card-body">
                    <div className="between" style={{ alignItems: 'flex-start' }}>
                      <div className="row" style={{ gap: 8 }}>
                        {item.isStaff === 1 && <span className="badge">Workshop</span>}
                        {item.make && <span className="badge badge-quiet">{item.make}</span>}
                        <span className="badge badge-quiet">{item.status}</span>
                      </div>
                      <span className="small mono muted">{item.createdAt}</span>
                    </div>

                    <h2 style={{ fontSize: '1.15rem', marginTop: 12 }}>{item.title}</h2>
                    <p className="small" style={{ marginTop: 8 }}>{item.description}</p>

                    <div className="row small muted" style={{ gap: 24, marginTop: 16, paddingTop: 14, borderTop: 'var(--border)' }}>
                      <span>Posted by <strong>{item.postedBy}</strong></span>
                      {item.budget && <span>Budget <strong>{item.budget}</strong></span>}
                      <span>Contact <strong>{item.contact}</strong></span>
                    </div>
                  </article>
                ))
              )}
            </div>

            {isSignedIn() ? (
              <PostForm onPosted={reload} />
            ) : (
              <div className="card card-body center">
                <h3>Sign in to post</h3>
                <p className="small muted" style={{ marginTop: 8 }}>
                  Wanted ads need an account so the workshop has a way to reply
                  when the part turns up.
                </p>
                <div className="stack" style={{ marginTop: 16 }}>
                  <Link to="/signin" className="btn btn-block">Sign in</Link>
                  <Link to="/register" className="btn btn-outline btn-block">Create an account</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
