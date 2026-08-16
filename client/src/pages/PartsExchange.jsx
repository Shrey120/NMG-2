import { useState } from 'react';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { PageHeader, Badge, StatusPill, Button, Loader, Empty } from '../components/ui.jsx';

function PostForm({ onPosted }) {
  const [form, setForm] = useState({ title: '', make: '', postedBy: '', have: '', want: '', description: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    await api.createExchange(form);
    setBusy(false);
    setForm({ title: '', make: '', postedBy: '', have: '', want: '', description: '' });
    onPosted();
  }

  return (
    <form onSubmit={submit} className="panel space-y-3 p-6">
      <h2 className="font-semibold">List a swap</h2>
      <p className="text-xs text-muted">
        The exchange mechanism is the biggest open question on the brief (question B2). This
        prototype models it as a noticeboard — post what you have, post what you want, arrange the
        trade directly.
      </p>
      <input className="field" placeholder="Short title" required value={form.title} onChange={set('title')} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" placeholder="Marque" value={form.make} onChange={set('make')} />
        <input className="field" placeholder="Your name" required value={form.postedBy} onChange={set('postedBy')} />
      </div>
      <input className="field" placeholder="What you have" required value={form.have} onChange={set('have')} />
      <input className="field" placeholder="What you want" required value={form.want} onChange={set('want')} />
      <textarea
        className="field min-h-20"
        placeholder="Any extra detail — condition, willingness to add cash…"
        value={form.description}
        onChange={set('description')}
      />
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? 'Posting…' : 'Post swap'}
      </Button>
    </form>
  );
}

export default function PartsExchange() {
  const { data, loading, reload } = useApi(() => api.exchanges(), []);
  const posts = data || [];

  return (
    <>
      <PageHeader
        eyebrow="Parts Exchange"
        title="Trade parts, not cash"
        blurb="Got something surplus to requirements that someone else needs? List what you have and what you are after."
      />

      <div className="mx-auto max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:flex">
        <div className="flex-1">
          {loading ? (
            <Loader />
          ) : posts.length === 0 ? (
            <Empty title="No swaps listed yet" />
          ) : (
            <div className="space-y-4">
              {posts.map((p) => (
                <article key={p.id} className="panel p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {p.isStaff && <Badge tone="accent">Workshop</Badge>}
                        {p.make && <Badge>{p.make}</Badge>}
                        <StatusPill status={p.status} />
                      </div>
                      <h2 className="text-lg font-semibold">{p.title}</h2>
                    </div>
                    <span className="font-mono text-xs text-muted">{p.createdAt}</span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                    <div className="rounded-lg border border-edge bg-ink p-4">
                      <p className="eyebrow mb-1.5">Has</p>
                      <p className="text-sm text-white/85">{p.have}</p>
                    </div>
                    <div className="grid place-items-center text-xl text-accent">⇄</div>
                    <div className="rounded-lg border border-edge bg-ink p-4">
                      <p className="eyebrow mb-1.5">Wants</p>
                      <p className="text-sm text-white/85">{p.want}</p>
                    </div>
                  </div>

                  {p.description && <p className="mt-4 text-sm text-muted">{p.description}</p>}

                  <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-edge pt-4 text-xs">
                    <span className="text-muted">
                      Posted by <span className="text-white">{p.postedBy}</span>
                    </span>
                    <span className="text-muted">
                      Contact <span className="text-accent">{p.contact}</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="mt-10 lg:mt-0 lg:w-96 lg:shrink-0">
          <div className="sticky top-24">
            <PostForm onPosted={reload} />
          </div>
        </aside>
      </div>
    </>
  );
}
