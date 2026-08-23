import { useState } from 'react';
import { useLoad } from '../../useLoad.js';
import { post, put, remove } from '../../api.js';
import Loading from '../../components/Loading.jsx';

const BLANK = { title: '', summary: '', detail: '', price: '', bookable: 1, sortOrder: 0 };

export default function AdminServices() {
  const { data, loading, reload } = useLoad('/services');
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    if (form.id) await put(`/services/${form.id}`, form);
    else await post('/services', form);
    setSaving(false);
    setForm(null);
    reload();
  }

  async function deleteService(service) {
    if (!confirm(`Delete "${service.title}"? Any bookings for it are deleted too.`)) return;
    await remove(`/services/${service.id}`);
    reload();
  }

  return (
    <div>
      <div className="between">
        <div>
          <h1>Services</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            The service list shown on the website and in the booking form.
          </p>
        </div>
        {!form && <button className="btn" onClick={() => setForm(BLANK)}>Add service</button>}
      </div>

      {form && (
        <form onSubmit={save} className="card card-body stack" style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: '1.2rem' }}>{form.id ? 'Edit service' : 'New service'}</h2>

          <div>
            <label className="label" htmlFor="s-title">Title</label>
            <input id="s-title" className="input" required value={form.title} onChange={update('title')} />
          </div>

          <div>
            <label className="label" htmlFor="s-summary">Short summary</label>
            <input id="s-summary" className="input" required value={form.summary} onChange={update('summary')} />
          </div>

          <div>
            <label className="label" htmlFor="s-detail">Full description</label>
            <textarea id="s-detail" className="input" required value={form.detail} onChange={update('detail')} />
          </div>

          <div className="grid grid-3" style={{ gap: 14 }}>
            <div>
              <label className="label" htmlFor="s-price">Price</label>
              <input id="s-price" className="input" placeholder="From $890" required value={form.price} onChange={update('price')} />
            </div>
            <div>
              <label className="label" htmlFor="s-order">Order</label>
              <input id="s-order" type="number" className="input" value={form.sortOrder} onChange={update('sortOrder')} />
            </div>
            <div>
              <label className="label" htmlFor="s-bookable">Bookable online</label>
              <select id="s-bookable" className="input" value={form.bookable} onChange={update('bookable')}>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
          </div>

          <div className="row">
            <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" className="btn btn-outline" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="table-wrap" style={{ marginTop: 24 }}>
          <table>
            <thead>
              <tr><th>Service</th><th>Price</th><th>Bookable</th><th>Order</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {(data || []).map((service) => (
                <tr key={service.id}>
                  <td>
                    <strong>{service.title}</strong>
                    <div className="small muted">{service.summary}</div>
                  </td>
                  <td className="mono">{service.price}</td>
                  <td>{service.bookable === 1 ? 'Yes' : 'No'}</td>
                  <td>{service.sortOrder}</td>
                  <td>
                    <button className="link-button small" onClick={() => setForm(service)}>Edit</button>
                    {' / '}
                    <button className="link-button small" onClick={() => deleteService(service)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
