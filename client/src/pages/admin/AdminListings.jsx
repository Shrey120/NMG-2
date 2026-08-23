import { useState } from 'react';
import { useLoad } from '../../useLoad.js';
import { post, put, remove, money } from '../../api.js';
import Loading from '../../components/Loading.jsx';

const EMPTY = {
  title: '',
  category: '',
  make: '',
  fitment: '',
  partNumber: '',
  itemCondition: 'Used - Good',
  price: '',
  quantity: 1,
  status: 'available',
  description: '',
};

const CONDITIONS = ['New', 'Refurbished', 'Used - Excellent', 'Used - Good', 'For parts'];
const STATUSES = ['available', 'reserved', 'sold'];

export default function AdminListings() {
  const { data, loading, reload } = useLoad('/listings');
  const [form, setForm] = useState(null); // null means the form is closed
  const [saving, setSaving] = useState(false);

  const listings = data?.listings || [];
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function save(event) {
    event.preventDefault();
    setSaving(true);

    // An existing listing has an id, a new one does not.
    if (form.id) await put(`/listings/${form.id}`, form);
    else await post('/listings', form);

    setSaving(false);
    setForm(null);
    reload();
  }

  async function deleteListing(listing) {
    if (!confirm(`Delete "${listing.title}"?`)) return;
    await remove(`/listings/${listing.id}`);
    reload();
  }

  return (
    <div>
      <div className="between">
        <div>
          <h1>Parts listings</h1>
          <p className="muted" style={{ marginTop: 6 }}>{listings.length} listings in total.</p>
        </div>
        {!form && <button className="btn" onClick={() => setForm(EMPTY)}>Add listing</button>}
      </div>

      {form && (
        <form onSubmit={save} className="card card-body stack" style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: '1.2rem' }}>{form.id ? 'Edit listing' : 'New listing'}</h2>

          <div>
            <label className="label" htmlFor="title">Title</label>
            <input id="title" className="input" required value={form.title} onChange={update('title')} />
          </div>

          <div className="grid grid-3" style={{ gap: 14 }}>
            <div>
              <label className="label" htmlFor="category">Category</label>
              <input id="category" className="input" required value={form.category} onChange={update('category')} />
            </div>
            <div>
              <label className="label" htmlFor="make">Marque</label>
              <input id="make" className="input" required value={form.make} onChange={update('make')} />
            </div>
            <div>
              <label className="label" htmlFor="partNumber">Part number</label>
              <input id="partNumber" className="input" value={form.partNumber} onChange={update('partNumber')} />
            </div>
            <div>
              <label className="label" htmlFor="price">Price</label>
              <input id="price" type="number" step="0.01" className="input" required value={form.price} onChange={update('price')} />
            </div>
            <div>
              <label className="label" htmlFor="quantity">Quantity</label>
              <input id="quantity" type="number" min="1" className="input" value={form.quantity} onChange={update('quantity')} />
            </div>
            <div>
              <label className="label" htmlFor="itemCondition">Condition</label>
              <select id="itemCondition" className="input" value={form.itemCondition} onChange={update('itemCondition')}>
                {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="status">Status</label>
              <select id="status" className="input" value={form.status} onChange={update('status')}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="label" htmlFor="fitment">Fitment</label>
              <input id="fitment" className="input" value={form.fitment} onChange={update('fitment')} />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" className="input" value={form.description} onChange={update('description')} />
          </div>

          <div className="row">
            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="table-wrap" style={{ marginTop: 24 }}>
          <table>
            <thead>
              <tr>
                <th>Part</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td>{listing.title}</td>
                  <td className="muted">{listing.category}</td>
                  <td className="mono">{money(listing.price)}</td>
                  <td>{listing.quantity}</td>
                  <td>{listing.status}</td>
                  <td>
                    <button className="link-button small" onClick={() => setForm(listing)}>Edit</button>
                    {' / '}
                    <button className="link-button small" onClick={() => deleteListing(listing)}>Delete</button>
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
