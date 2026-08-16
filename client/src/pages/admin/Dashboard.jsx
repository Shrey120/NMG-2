import { Link } from 'react-router-dom';
import { api, money } from '../../api.js';
import { useApi } from '../../useApi.js';
import { Loader, Button, StatusPill } from '../../components/ui.jsx';

function Stat({ label, value, sub, to }) {
  const inner = (
    <>
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </>
  );
  return to ? (
    <Link to={to} className="panel p-5 transition hover:border-accent/50">
      {inner}
    </Link>
  ) : (
    <div className="panel p-5">{inner}</div>
  );
}

export default function Dashboard() {
  const stats = useApi(() => api.stats(), []);
  const enquiries = useApi(() => api.enquiries(), []);

  async function reset() {
    if (!confirm('Restore all sample data? Any changes you have made in this session will be lost.'))
      return;
    await api.resetData();
    stats.reload();
    enquiries.reload();
  }

  if (stats.loading) return <Loader label="Loading dashboard" />;
  const s = stats.data;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Overview of listings, enquiries and community posts.</p>
        </div>
        <Button variant="ghost" onClick={reset}>
          Restore sample data
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Unread enquiries"
          value={s.enquiries.unread}
          sub={`${s.enquiries.total} total`}
          to="/admin/enquiries"
        />
        <Stat
          label="Parts available"
          value={s.listings.available}
          sub={`${s.listings.total} listings · ${s.listings.sold} sold`}
          to="/admin/listings"
        />
        <Stat label="Stock value" value={money(s.listings.value)} sub="Available parts only" />
        <Stat
          label="Community posts"
          value={s.wanted + s.exchanges}
          sub={`${s.wanted} wanted · ${s.exchanges} exchange`}
          to="/admin/posts"
        />
      </div>

      {s.pendingTestimonials > 0 && (
        <div className="panel mt-6 flex flex-wrap items-center justify-between gap-4 border-accent/30 bg-accent/5 p-5">
          <div>
            <p className="font-semibold text-accent">
              {s.pendingTestimonials} testimonial awaiting approval
            </p>
            <p className="mt-1 text-sm text-muted">
              Reviews submitted through the site are held until approved.
            </p>
          </div>
          <Button as="link" to="/admin/testimonials" variant="ghost">
            Review now
          </Button>
        </div>
      )}

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent enquiries</h2>
          <Link to="/admin/enquiries" className="text-sm text-accent hover:underline">
            View all →
          </Link>
        </div>

        {enquiries.loading ? (
          <Loader />
        ) : (
          <div className="panel divide-y divide-edge">
            {(enquiries.data || []).slice(0, 5).map((e) => (
              <div key={e.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{e.name}</span>
                    <StatusPill status={e.status} />
                    <span className="text-xs text-muted">{e.type}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">{e.subject}</p>
                </div>
                <span className="font-mono text-xs text-muted">{e.createdAt.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
