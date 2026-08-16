import { useState } from 'react';
import { api } from '../../api.js';
import { useApi } from '../../useApi.js';
import { Loader, Button, StatusPill, Empty, Badge } from '../../components/ui.jsx';

const FILTERS = ['All', 'new', 'read', 'replied'];

export default function ManageEnquiries() {
  const { data, loading, reload } = useApi(() => api.enquiries(), []);
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null);

  const all = data || [];
  const shown = filter === 'All' ? all : all.filter((e) => e.status === filter);

  async function setStatus(enquiry, status) {
    await api.updateEnquiry(enquiry.id, status);
    reload();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Enquiries</h1>
        <p className="mt-1 text-sm text-muted">
          Everything submitted through the contact form, part enquiries and partnership requests.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = f === 'All' ? all.length : all.filter((e) => e.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg border px-4 py-2 text-sm capitalize transition ${
                filter === f ? 'border-accent bg-accent/10 text-accent' : 'border-edge text-muted hover:text-white'
              }`}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <Loader />
      ) : shown.length === 0 ? (
        <Empty title="Nothing here" blurb="No enquiries match this filter." />
      ) : (
        <div className="space-y-3">
          {shown.map((e) => {
            const expanded = open === e.id;
            return (
              <article key={e.id} className="panel overflow-hidden">
                <button
                  onClick={() => {
                    setOpen(expanded ? null : e.id);
                    if (!expanded && e.status === 'new') setStatus(e, 'read');
                  }}
                  className="flex w-full flex-wrap items-start justify-between gap-3 p-5 text-left hover:bg-panel-2/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{e.name}</span>
                      <StatusPill status={e.status} />
                      <Badge>{e.type}</Badge>
                    </div>
                    <p className="mt-1.5 truncate text-sm">{e.subject}</p>
                    <p className="mt-1 truncate text-xs text-muted">
                      {e.email} {e.phone && `· ${e.phone}`} {e.vehicle && `· ${e.vehicle}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-muted">{e.createdAt.slice(0, 10)}</span>
                    <span className="mt-1 block text-xs text-accent">{expanded ? 'Close' : 'Open'}</span>
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-edge bg-ink p-5">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
                      {e.message}
                    </p>
                    {e.listingId && (
                      <p className="mt-3 text-xs text-muted">
                        Regarding listing <span className="font-mono text-accent">{e.listingId}</span>
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button
                        as="a"
                        variant="ghost"
                        onClick={() => (window.location.href = `mailto:${e.email}?subject=Re: ${e.subject}`)}
                      >
                        Reply by email
                      </Button>
                      {e.status !== 'replied' && (
                        <Button variant="subtle" onClick={() => setStatus(e, 'replied')}>
                          Mark as replied
                        </Button>
                      )}
                      {e.status !== 'new' && (
                        <Button variant="subtle" onClick={() => setStatus(e, 'new')}>
                          Mark unread
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
