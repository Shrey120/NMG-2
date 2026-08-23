import { useState } from 'react';
import { useLoad } from '../useLoad.js';
import { post } from '../api.js';
import Loading from '../components/Loading.jsx';

export default function Exchange() {
  const { data, loading, reload } = useLoad('/exchanges');
  const [form, setForm] = useState({ title: '', make: '', postedBy: '', offering: '', wanting: '', description: '' });
  const [saving, setSaving] = useState(false);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    await post('/exchanges', form);
    setForm({ title: '', make: '', postedBy: '', offering: '', wanting: '', description: '' });
    setSaving(false);
    reload();
  }

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Parts Exchange</p>
          <h1 style={{ marginTop: 12 }}>Trade parts, not cash</h1>
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
                      </div>
                      <span className="small mono muted">{item.createdAt}</span>
                    </div>

                    <h2 style={{ fontSize: '1.15rem', marginTop: 12 }}>{item.title}</h2>

                    <div className="swap" style={{ marginTop: 16 }}>
                      <div className="swap-box">
                        <p className="eyebrow">Has</p>
                        <p className="small" style={{ marginTop: 6 }}>{item.offering}</p>
                      </div>
                      <div className="swap-arrow">&#8644;</div>
                      <div className="swap-box">
                        <p className="eyebrow">Wants</p>
                        <p className="small" style={{ marginTop: 6 }}>{item.wanting}</p>
                      </div>
                    </div>

                    {item.description && <p className="small muted" style={{ marginTop: 14 }}>{item.description}</p>}

                    <div className="row small muted" style={{ gap: 24, marginTop: 16, paddingTop: 14, borderTop: 'var(--border)' }}>
                      <span>Posted by <strong>{item.postedBy}</strong></span>
                      <span>Contact <strong>{item.contact}</strong></span>
                    </div>
                  </article>
                ))
              )}
            </div>

            <form onSubmit={submit} className="card card-body stack">
              <h3>List a swap</h3>
              <p className="form-note">
                Post what you have and what you want, then arrange the trade directly.
              </p>
              <input className="input" placeholder="Short title" required value={form.title} onChange={update('title')} aria-label="Title" />
              <input className="input" placeholder="Marque" value={form.make} onChange={update('make')} aria-label="Marque" />
              <input className="input" placeholder="Your name" required value={form.postedBy} onChange={update('postedBy')} aria-label="Your name" />
              <input className="input" placeholder="What you have" required value={form.offering} onChange={update('offering')} aria-label="What you have" />
              <input className="input" placeholder="What you want" required value={form.wanting} onChange={update('wanting')} aria-label="What you want" />
              <textarea className="input" placeholder="Any extra detail" value={form.description} onChange={update('description')} aria-label="Extra detail" />
              <button type="submit" className="btn btn-block" disabled={saving}>
                {saving ? 'Posting...' : 'Post swap'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
