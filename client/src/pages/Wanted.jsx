import { useState } from 'react';
import { useLoad } from '../useLoad.js';
import { post } from '../api.js';
import Loading from '../components/Loading.jsx';

export default function Wanted() {
  const { data, loading, reload } = useLoad('/wanted');
  const [form, setForm] = useState({ title: '', make: '', postedBy: '', budget: '', description: '' });
  const [saving, setSaving] = useState(false);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    await post('/wanted', form);
    setForm({ title: '', make: '', postedBy: '', budget: '', description: '' });
    setSaving(false);
    reload(); // fetch the list again so the new post shows up
  }

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Parts Wanted</p>
          <h1 style={{ marginTop: 12 }}>Chasing something specific?</h1>
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

            <form onSubmit={submit} className="card card-body stack">
              <h3>Post what you need</h3>
              <input className="input" placeholder="Part you are after" required value={form.title} onChange={update('title')} aria-label="Part you are after" />
              <input className="input" placeholder="Marque" value={form.make} onChange={update('make')} aria-label="Marque" />
              <input className="input" placeholder="Your name" required value={form.postedBy} onChange={update('postedBy')} aria-label="Your name" />
              <input className="input" placeholder="Budget" value={form.budget} onChange={update('budget')} aria-label="Budget" />
              <textarea className="input" placeholder="Details, fitment, how far you will travel" required value={form.description} onChange={update('description')} aria-label="Details" />
              <button type="submit" className="btn btn-block" disabled={saving}>
                {saving ? 'Posting...' : 'Post wanted ad'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
