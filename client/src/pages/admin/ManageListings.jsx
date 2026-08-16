import { useState } from 'react';
import { api, money } from '../../api.js';
import { useApi } from '../../useApi.js';
import { Loader, Button, StatusPill, Empty } from '../../components/ui.jsx';

const BLANK = {
  title: '',
  category: '',
  make: '',
  fitment: '',
  partNumber: '',
  condition: 'Used — Good',
  price: '',
  quantity: 1,
  status: 'available',
  description: '',
};

const CONDITIONS = ['New', 'Refurbished', 'Used — Excellent', 'Used — Good', 'For parts'];
const STATUSES = ['available', 'reserved', 'sold'];

function ListingForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({ ...BLANK, ...initial });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (initial?.id) await api.updateListing(initial.id, form);
      else await api.createListing(form);
      onSaved();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="panel mb-6 space-y-4 p-6">
      <h2 className="font-semibold">{initial?.id ? 'Edit listing' : 'New listing'}</h2>

      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Title *</span>
        <input className="field" required value={form.title} onChange={set('title')} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Category</span>
          <input className="field" value={form.category} onChange={set('category')} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Marque</span>
          <input className="field" value={form.make} onChange={set('make')} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Part number</span>
          <input className="field" value={form.partNumber} onChange={set('partNumber')} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Price (AUD) *</span>
          <input className="field" type="number" required value={form.price} onChange={set('price')} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Quantity</span>
          <input className="field" type="number" min="1" value={form.quantity} onChange={set('quantity')} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Condition</span>
          <select className="field" value={form.condition} onChange={set('condition')}>
            {CONDITIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Fitment</span>
          <input className="field" value={form.fitment} onChange={set('fitment')} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Status</span>
          <select className="field" value={form.status} onChange={set('status')}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Description</span>
        <textarea className="field min-h-28" value={form.description} onChange={set('description')} />
      </label>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? 'Saving…' : initial?.id ? 'Save changes' : 'Create listing'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function ManageListings() {
  const { data, loading, reload } = useApi(() => api.listings({}), []);
  const [editing, setEditing] = useState(null); // null | {} | listing
  const items = data?.items || [];

  async function remove(listing) {
    if (!confirm(`Delete "${listing.title}"?`)) return;
    await api.deleteListing(listing.id);
    reload();
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Parts listings</h1>
          <p className="mt-1 text-sm text-muted">
            Create, edit and remove marketplace listings. {items.length} in total.
          </p>
        </div>
        {!editing && <Button onClick={() => setEditing({})}>+ New listing</Button>}
      </div>

      {editing && (
        <ListingForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <Empty title="No listings yet" action={<Button onClick={() => setEditing({})}>Add the first one</Button>} />
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-edge text-left text-xs uppercase tracking-wider text-muted">
                <th className="p-4 font-medium">Part</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Qty</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {items.map((l) => (
                <tr key={l.id} className="hover:bg-panel-2/50">
                  <td className="max-w-xs p-4">
                    <p className="truncate font-medium">{l.title}</p>
                    <p className="truncate text-xs text-muted">{l.fitment}</p>
                  </td>
                  <td className="p-4 text-muted">{l.category}</td>
                  <td className="p-4 font-mono">{money(l.price)}</td>
                  <td className="p-4 text-muted">{l.quantity}</td>
                  <td className="p-4">
                    <StatusPill status={l.status} />
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button onClick={() => setEditing(l)} className="text-accent hover:underline">
                      Edit
                    </button>
                    <span className="mx-2 text-edge">|</span>
                    <button onClick={() => remove(l)} className="text-rose-400 hover:underline">
                      Delete
                    </button>
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
