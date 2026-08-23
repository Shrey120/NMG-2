import { useState } from 'react';
import { useLoad } from '../../useLoad.js';
import { post, put, patch, remove } from '../../api.js';
import Loading from '../../components/Loading.jsx';

const BLANK_EXCHANGE = { title: '', make: '', offering: '', wanting: '', description: '', status: 'open' };

function ExchangeForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    if (form.id) await put(`/exchanges/${form.id}`, form);
    else await post('/exchanges', form);
    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={submit} className="card card-body stack" style={{ marginTop: 20 }}>
      <h3>{form.id ? 'Edit exchange item' : 'New exchange item'}</h3>

      <div>
        <label className="label" htmlFor="ex-title">Title</label>
        <input id="ex-title" className="input" required value={form.title} onChange={update('title')} />
      </div>

      <div className="grid grid-2" style={{ gap: 14 }}>
        <div>
          <label className="label" htmlFor="ex-make">Marque</label>
          <input id="ex-make" className="input" value={form.make} onChange={update('make')} />
        </div>
        <div>
          <label className="label" htmlFor="ex-status">Status</label>
          <select id="ex-status" className="input" value={form.status} onChange={update('status')}>
            <option value="open">open</option>
            <option value="traded">traded</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="ex-offering">What we have</label>
        <input id="ex-offering" className="input" required value={form.offering} onChange={update('offering')} />
      </div>

      <div>
        <label className="label" htmlFor="ex-wanting">What we want</label>
        <input id="ex-wanting" className="input" required value={form.wanting} onChange={update('wanting')} />
      </div>

      <div>
        <label className="label" htmlFor="ex-description">Details</label>
        <textarea id="ex-description" className="input" value={form.description} onChange={update('description')} />
      </div>

      <div className="row">
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function AdminPosts() {
  // Staff see every wanted ad, approved or not, so they can work the queue.
  const wanted = useLoad('/wanted?pending=true');
  const exchanges = useLoad('/exchanges');
  const [tab, setTab] = useState('wanted');
  const [form, setForm] = useState(null);

  const showingWanted = tab === 'wanted';

  async function approve(item, approved) {
    await patch(`/wanted/${item.id}`, { approved });
    wanted.reload();
  }

  async function deleteItem(item) {
    if (!confirm(`Remove "${item.title}"?`)) return;
    await remove(`/${showingWanted ? 'wanted' : 'exchanges'}/${item.id}`);
    (showingWanted ? wanted : exchanges).reload();
  }

  const pendingCount = (wanted.data || []).filter((item) => item.approved === 0).length;

  return (
    <div>
      <h1>Wanted &amp; Exchange</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Customer wanted ads wait here for approval. Exchange items are created by
        the workshop.
      </p>

      <div className="row" style={{ margin: '24px 0' }}>
        <button className={showingWanted ? 'pill pill-on' : 'pill'} onClick={() => { setTab('wanted'); setForm(null); }}>
          Parts Wanted ({wanted.data?.length || 0}{pendingCount > 0 ? `, ${pendingCount} waiting` : ''})
        </button>
        <button className={!showingWanted ? 'pill pill-on' : 'pill'} onClick={() => setTab('exchange')}>
          Exchange items ({exchanges.data?.length || 0})
        </button>

        {!showingWanted && !form && (
          <button className="btn btn-small" onClick={() => setForm(BLANK_EXCHANGE)}>Add exchange item</button>
        )}
      </div>

      {!showingWanted && form && (
        <ExchangeForm
          initial={form}
          onCancel={() => setForm(null)}
          onSaved={() => { setForm(null); exchanges.reload(); }}
        />
      )}

      {(showingWanted ? wanted.loading : exchanges.loading) ? (
        <Loading />
      ) : (
        <div className="stack" style={{ marginTop: 20 }}>
          {showingWanted
            ? (wanted.data || []).map((item) => (
                <article key={item.id} className="card card-body between" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div className="row" style={{ gap: 8 }}>
                      {item.isStaff === 1 && <span className="badge">Workshop</span>}
                      {item.make && <span className="badge badge-quiet">{item.make}</span>}
                      <span className="badge badge-quiet">
                        {item.approved === 1 ? 'published' : 'waiting for approval'}
                      </span>
                    </div>
                    <h3 style={{ marginTop: 10 }}>{item.title}</h3>
                    <p className="small muted" style={{ marginTop: 6 }}>{item.description}</p>
                    <p className="small muted" style={{ marginTop: 8 }}>
                      {item.postedBy} - {item.createdAt} - {item.contact}
                    </p>
                  </div>

                  <div className="stack" style={{ flexShrink: 0 }}>
                    <button
                      className={item.approved === 1 ? 'btn btn-outline btn-small' : 'btn btn-small'}
                      onClick={() => approve(item, item.approved === 0)}
                    >
                      {item.approved === 1 ? 'Unpublish' : 'Approve'}
                    </button>
                    <button className="link-button small" onClick={() => deleteItem(item)}>Remove</button>
                  </div>
                </article>
              ))
            : (exchanges.data || []).map((item) => (
                <article key={item.id} className="card card-body between" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div className="row" style={{ gap: 8 }}>
                      {item.make && <span className="badge badge-quiet">{item.make}</span>}
                      <span className="badge badge-quiet">{item.status}</span>
                      <span className="small muted">{item.offerCount} offers</span>
                    </div>
                    <h3 style={{ marginTop: 10 }}>{item.title}</h3>
                    <p className="small muted" style={{ marginTop: 6 }}>
                      {item.offering} for {item.wanting}
                    </p>
                  </div>

                  <div className="stack" style={{ flexShrink: 0 }}>
                    <button className="btn btn-outline btn-small" onClick={() => setForm(item)}>Edit</button>
                    <button className="link-button small" onClick={() => deleteItem(item)}>Remove</button>
                  </div>
                </article>
              ))}
        </div>
      )}
    </div>
  );
}
