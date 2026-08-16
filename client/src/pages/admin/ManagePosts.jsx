import { useState } from 'react';
import { api } from '../../api.js';
import { useApi } from '../../useApi.js';
import { Loader, StatusPill, Empty, Badge } from '../../components/ui.jsx';

export default function ManagePosts() {
  const wanted = useApi(() => api.wanted(), []);
  const exchanges = useApi(() => api.exchanges(), []);
  const [tab, setTab] = useState('wanted');

  const isWanted = tab === 'wanted';
  const source = isWanted ? wanted : exchanges;
  const posts = source.data || [];

  async function remove(post) {
    if (!confirm(`Remove "${post.title}"?`)) return;
    if (isWanted) await api.deleteWanted(post.id);
    else await api.deleteExchange(post.id);
    source.reload();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Wanted &amp; Exchange</h1>
        <p className="mt-1 text-sm text-muted">
          Community posts. Whether these need approval before going live is still to be confirmed
          (question B4).
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        {[
          ['wanted', `Parts Wanted (${wanted.data?.length || 0})`],
          ['exchange', `Exchange (${exchanges.data?.length || 0})`],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              tab === key ? 'border-accent bg-accent/10 text-accent' : 'border-edge text-muted hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {source.loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <Empty title="No posts" />
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <article key={p.id} className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {p.isStaff && <Badge tone="accent">Workshop</Badge>}
                    {p.make && <Badge>{p.make}</Badge>}
                    <StatusPill status={p.status} />
                  </div>
                  <h2 className="font-semibold">{p.title}</h2>
                  {isWanted ? (
                    <p className="mt-1.5 text-sm text-muted">{p.description}</p>
                  ) : (
                    <p className="mt-1.5 text-sm text-muted">
                      <span className="text-white/80">{p.have}</span>
                      <span className="mx-2 text-accent">⇄</span>
                      <span className="text-white/80">{p.want}</span>
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    {p.postedBy} · {p.createdAt} · {p.contact}
                  </p>
                </div>
                <button onClick={() => remove(p)} className="text-sm text-rose-400 hover:underline">
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
