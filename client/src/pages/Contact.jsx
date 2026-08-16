import { useState } from 'react';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { PageHeader, Button } from '../components/ui.jsx';

const TYPES = ['General', 'Service', 'Parts', 'Collaboration'];

export default function Contact() {
  const { data: business } = useApi(() => api.business(), []);
  const [form, setForm] = useState({
    type: 'General',
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    subject: '',
    message: '',
  });
  const [state, setState] = useState('idle');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState('sending');
    try {
      await api.sendEnquiry(form);
      setState('sent');
    } catch {
      setState('error');
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        blurb="Tell us about the car and what you want from it. The more detail you give, the more useful our first reply will be."
      />

      <div className="mx-auto max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:flex">
        {/* Form */}
        <div className="flex-1">
          {state === 'sent' ? (
            <div className="panel grid place-items-center px-6 py-20 text-center">
              <p className="text-2xl font-bold text-emerald-400">Enquiry sent</p>
              <p className="mt-3 max-w-md text-sm text-muted">
                In the live build this would be emailed to the workshop's nominated address — still
                to be confirmed with the client (question D2). For now it is stored and visible in
                the admin panel.
              </p>
              <Button variant="ghost" className="mt-6" onClick={() => setState('idle')}>
                Send another
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="panel space-y-4 p-7">
              <div>
                <span className="mb-2 block text-xs uppercase tracking-wider text-muted">
                  What is this about?
                </span>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className={`rounded-lg border px-4 py-2 text-sm transition ${
                        form.type === t
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-edge text-muted hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Name *</span>
                  <input className="field" required value={form.name} onChange={set('name')} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Email *</span>
                  <input className="field" type="email" required value={form.email} onChange={set('email')} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Phone</span>
                  <input className="field" value={form.phone} onChange={set('phone')} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
                    Vehicle
                  </span>
                  <input
                    className="field"
                    placeholder="Year, make, model"
                    value={form.vehicle}
                    onChange={set('vehicle')}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Subject *</span>
                <input className="field" required value={form.subject} onChange={set('subject')} />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted">Message *</span>
                <textarea
                  className="field min-h-40"
                  required
                  value={form.message}
                  onChange={set('message')}
                />
              </label>

              <Button type="submit" className="w-full" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Send enquiry'}
              </Button>
              {state === 'error' && <p className="text-sm text-rose-400">Something went wrong.</p>}
              <p className="text-[11px] leading-relaxed text-muted">
                The exact fields collected here are still to be confirmed with the client
                (question D1). Nothing submitted in this prototype is stored permanently.
              </p>
            </form>
          )}
        </div>

        {/* Details */}
        <aside className="mt-10 space-y-5 lg:mt-0 lg:w-80 lg:shrink-0">
          <div className="panel p-6">
            <h2 className="mb-4 font-semibold">Workshop details</h2>
            <dl className="space-y-3 text-sm">
              {[
                ['Email', business?.email],
                ['Phone', business?.phone],
                ['Location', business?.suburb],
                ['ABN', business?.abn],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-wider text-muted">{k}</dt>
                  <dd className="mt-0.5">{v || '—'}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 border-t border-edge pt-3 text-[11px] text-muted">
              Placeholder details. Real business information pending client confirmation
              (question J1).
            </p>
          </div>

          <div className="panel p-6">
            <h2 className="mb-4 font-semibold">Opening hours</h2>
            <dl className="space-y-2 text-sm">
              {(business?.hours || []).map((h) => (
                <div key={h.day} className="flex justify-between gap-4">
                  <dt className="text-muted">{h.day}</dt>
                  <dd>{h.open}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="panel grid aspect-video place-items-center p-6 text-center">
            <div>
              <p className="text-sm font-medium">Map placeholder</p>
              <p className="mt-1 text-xs text-muted">
                Embed added once the client confirms whether a full address is shown publicly.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
