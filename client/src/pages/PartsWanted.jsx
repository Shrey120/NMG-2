import { useState } from 'react';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { PageHeader, Badge, StatusPill, Button, Loader, Empty } from '../components/ui.jsx';

function PostForm({ onPosted }) {
  const [form, setForm] = useState({
    title: '',
    make: '',
    postedBy: '',
    budget: '',
    condition: '',
    description: '',
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    await api.createWanted({ ...form, title: `Wanted: ${form.title}` });
    setBusy(false);
    setForm({ title: '', make: '', postedBy: '', budget: '', condition: '', description: '' });
    onPosted();
  }

  return (
    <form onSubmit={submit} className="panel space-y-3 p-6">
      <h2 className="font-semibold">Post what you are chasing</h2>
      <p className="text-xs text-muted">
        Who can post here is still to be confirmed with the client (question B1). For the prototype,
        anyone can.
      </p>
      <input className="field" placeholder="Part you need" required value={form.title} onChange={set('title')} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" placeholder="Marque (e.g. BMW)" value={form.make} onChange={set('make')} />
        <input className="field" placeholder="Your name" required value={form.postedBy} onChange={set('postedBy')} />
        <input className="field" placeholder="Budget" value={form.budget} onChange={set('budget')} />
        <input
          className="field"
          placeholder="Condition accepted"
          value={form.condition}
          onChange={set('condition')}
        />
      </div>
      <textarea
        className="field min-h-24"
        placeholder="Details — fitment, year range, how far you will travel…"
        required
        value={form.description}
        onChange={set('description')}
      />
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? 'Posting…' : 'Post wanted ad'}
      </Button>
    </form>
  );
}

export default function PartsWanted() {
  const { data, loading, reload } = useApi(() => api.wanted(), []);
  const posts = data || [];

  return (
    <>
      <PageHeader
        eyebrow="Parts Wanted"
        title="Chasing something specific?"
        blurb="Wanted ads from the workshop and from the community. If we spot what you are after through our supplier network, we will let you know."
      />

      <div className="mx-auto max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:flex">
        <div className="flex-1">
          {loading ? (
            <Loader />
          ) : posts.length === 0 ? (
            <Empty title="No wanted ads yet" />
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

                  <p className="mt-3 text-sm leading-relaxed text-white/80">{p.description}</p>

                  <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-edge pt-4 text-xs">
                    <span className="text-muted">
                      Posted by <span className="text-white">{p.postedBy}</span>
                    </span>
                    {p.budget && (
                      <span className="text-muted">
                        Budget <span className="text-white">{p.budget}</span>
                      </span>
                    )}
                    {p.condition && (
                      <span className="text-muted">
                        Condition <span className="text-white">{p.condition}</span>
                      </span>
                    )}
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
