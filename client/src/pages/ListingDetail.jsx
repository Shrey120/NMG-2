import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, money } from '../api.js';
import { useApi } from '../useApi.js';
import { Thumb, Badge, StatusPill, Button, Loader, Empty } from '../components/ui.jsx';

function EnquiryForm({ listing }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', vehicle: '', message: '' });
  const [state, setState] = useState('idle');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState('sending');
    try {
      await api.sendEnquiry({
        ...form,
        type: 'Parts',
        subject: `Enquiry: ${listing.title}`,
        listingId: listing.id,
      });
      setState('sent');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div className="panel border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
        <p className="font-semibold text-emerald-400">Enquiry sent</p>
        <p className="mt-2 text-sm text-muted">
          It will appear in the admin panel under Enquiries. In the live build it would also be
          emailed to the workshop.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="panel space-y-3 p-6">
      <h3 className="font-semibold">Enquire about this part</h3>
      <input className="field" placeholder="Your name" required value={form.name} onChange={set('name')} />
      <input
        className="field"
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={set('email')}
      />
      <input className="field" placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} />
      <input
        className="field"
        placeholder="Your vehicle (e.g. 1989 BMW E30)"
        value={form.vehicle}
        onChange={set('vehicle')}
      />
      <textarea
        className="field min-h-24"
        placeholder="Anything you want to ask — freight, condition, fitment…"
        value={form.message}
        onChange={set('message')}
      />
      <Button type="submit" className="w-full" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send enquiry'}
      </Button>
      {state === 'error' && <p className="text-sm text-rose-400">Something went wrong. Try again.</p>}
      <p className="text-[11px] leading-relaxed text-muted">
        Prototype: no payment is taken on this site. Enquiries are stored locally for demonstration.
      </p>
    </form>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const { data: listing, loading, error } = useApi(() => api.listing(id), [id]);

  if (loading) return <Loader label="Loading part" />;
  if (error || !listing)
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <Empty
          title="Part not found"
          blurb="This listing may have sold and been removed."
          action={
            <Button as="link" to="/marketplace" variant="ghost">
              Back to marketplace
            </Button>
          }
        />
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link to="/marketplace" className="text-sm text-muted hover:text-accent">
        ← Back to marketplace
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Thumb label={listing.title} seed={listing.id} ratio="aspect-[4/3]" />
          <div className="mt-3 grid grid-cols-3 gap-3">
            {['Detail', 'Fitment', 'Packaging'].map((v) => (
              <Thumb key={v} label={v} seed={`${listing.id}-${v}`} ratio="aspect-square" />
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold">Description</h2>
            <p className="mt-3 leading-relaxed text-white/80">{listing.description}</p>
          </div>
        </div>

        <div className="space-y-5 lg:col-span-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">{listing.category}</Badge>
              <StatusPill status={listing.status} />
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{listing.title}</h1>
            <p className="mt-4 font-mono text-4xl font-black text-accent">{money(listing.price)}</p>
          </div>

          <dl className="panel divide-y divide-edge p-6 text-sm">
            {[
              ['Marque', listing.make],
              ['Fitment', listing.fitment],
              ['Condition', listing.condition],
              ['Part number', listing.partNumber],
              ['Quantity', listing.quantity],
              ['Listed', listing.createdAt],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-2.5 first:pt-0 last:pb-0">
                <dt className="shrink-0 text-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          {listing.status === 'available' ? (
            <EnquiryForm listing={listing} />
          ) : (
            <div className="panel p-6 text-center">
              <p className="font-semibold">This part is {listing.status}</p>
              <p className="mt-2 text-sm text-muted">
                We may be able to source another. Post it in Parts Wanted and we will keep an eye out.
              </p>
              <Button as="link" to="/parts-wanted" variant="ghost" className="mt-4 w-full">
                Post a wanted ad
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
