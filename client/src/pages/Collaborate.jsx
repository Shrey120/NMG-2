import { useState } from 'react';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { PageHeader, Badge, Button, Loader } from '../components/ui.jsx';

export default function Collaborate() {
  const { data, loading } = useApi(() => api.collaborations(), []);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [state, setState] = useState('idle');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState('sending');
    try {
      await api.sendEnquiry({
        ...form,
        vehicle: form.company || 'N/A',
        type: 'Collaboration',
        subject: `Partnership enquiry from ${form.company || form.name}`,
      });
      setState('sent');
    } catch {
      setState('error');
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Collaborate"
        title="Partners, suppliers and trade work"
        blurb="A one-person workshop can only go so far alone. We work with other trades, suppliers and creators — and we are always open to a conversation."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {(data || []).map((c) => (
              <div key={c.id} className="panel p-7">
                <h2 className="text-lg font-bold">{c.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.description}</p>
                <p className="eyebrow mt-6 mb-3">Looking for</p>
                <div className="flex flex-wrap gap-2">
                  {c.lookingFor.map((l) => (
                    <Badge key={l}>{l}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Start a partnership conversation
            </h2>
            <p className="mt-4 text-muted">
              Tell us who you are and what you are proposing. Trade enquiries usually get a reply
              within a working day.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                ['Overflow capacity', 'Fabrication, engine work and diagnostics for other workshops.'],
                ['Reciprocal referrals', 'We refer out panel, paint and trim work constantly.'],
                ['Parts network', 'Access to our sourcing contacts across Europe and Japan.'],
              ].map(([title, blurb]) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted">{blurb}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {state === 'sent' ? (
            <div className="panel grid place-items-center p-10 text-center">
              <p className="text-lg font-semibold text-emerald-400">Thanks — message received</p>
              <p className="mt-2 text-sm text-muted">
                Your enquiry is now visible in the admin panel under Enquiries.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="panel space-y-3 p-7">
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="field" placeholder="Your name" required value={form.name} onChange={set('name')} />
                <input className="field" placeholder="Business name" value={form.company} onChange={set('company')} />
                <input
                  className="field"
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={set('email')}
                />
                <input className="field" placeholder="Phone" value={form.phone} onChange={set('phone')} />
              </div>
              <textarea
                className="field min-h-32"
                placeholder="What are you proposing?"
                required
                value={form.message}
                onChange={set('message')}
              />
              <Button type="submit" className="w-full" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Send partnership enquiry'}
              </Button>
              {state === 'error' && <p className="text-sm text-rose-400">Something went wrong.</p>}
            </form>
          )}
        </div>
      </div>
    </>
  );
}
