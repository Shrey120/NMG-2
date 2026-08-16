import { api } from '../../api.js';
import { useApi } from '../../useApi.js';
import { Loader, Button, Badge, Stars, Empty } from '../../components/ui.jsx';

export default function ManageTestimonials() {
  const { data, loading, reload } = useApi(() => api.testimonials(true), []);
  const all = data || [];
  const pending = all.filter((t) => !t.approved);
  const live = all.filter((t) => t.approved);

  async function toggle(t) {
    await api.approveTestimonial(t.id, !t.approved);
    reload();
  }

  function Card({ t }) {
    return (
      <article className="panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Stars n={t.rating} />
            <p className="mt-3 font-semibold">{t.name}</p>
            <p className="text-xs text-muted">
              {t.vehicle} · {t.date}
            </p>
          </div>
          <Badge tone={t.approved ? 'green' : 'amber'}>{t.approved ? 'Published' : 'Pending'}</Badge>
        </div>
        <blockquote className="mt-4 text-sm leading-relaxed text-white/80">“{t.quote}”</blockquote>
        <Button
          variant={t.approved ? 'ghost' : 'primary'}
          className="mt-5"
          onClick={() => toggle(t)}
        >
          {t.approved ? 'Unpublish' : 'Approve & publish'}
        </Button>
      </article>
    );
  }

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
        <p className="mt-1 text-sm text-muted">
          Reviews submitted through the site are held here until approved. Whether real reviews
          exist yet is question F2 on the Round 1 sheet.
        </p>
      </div>

      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">
            Awaiting approval <span className="text-accent">({pending.length})</span>
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {pending.map((t) => (
              <Card key={t.id} t={t} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Published ({live.length})</h2>
        {live.length === 0 ? (
          <Empty title="Nothing published yet" />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {live.map((t) => (
              <Card key={t.id} t={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
