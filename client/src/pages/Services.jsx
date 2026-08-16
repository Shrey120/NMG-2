import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { PageHeader, Loader, Button, Badge } from '../components/ui.jsx';

export default function Services() {
  const { data, loading } = useApi(() => api.services(), []);

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="What we do, and how we do it"
        blurb="Six core services. Every job is quoted in writing, photographed as it progresses, and handed back with an explanation of what was done and why."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-6">
            {(data || []).map((s, i) => (
              <article key={s.id} className="panel overflow-hidden md:flex">
                <div className="flex items-start gap-5 p-7 md:w-2/3">
                  <span className="font-mono text-3xl font-black text-edge">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold">{s.title}</h2>
                    <p className="mt-2 text-sm text-muted">{s.summary}</p>
                    <p className="mt-4 text-sm leading-relaxed text-white/75">{s.detail}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {s.highlights.map((h) => (
                        <Badge key={h}>{h}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-edge bg-panel-2 p-7 md:w-1/3 md:border-l md:border-t-0">
                  <p className="text-xs uppercase tracking-wider text-muted">Indicative pricing</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-accent">{s.price}</p>
                  <p className="mt-3 text-xs text-muted">
                    Final pricing confirmed after inspection. Pricing shown is placeholder pending
                    client confirmation.
                  </p>
                  <Button as="link" to="/contact" variant="ghost" className="mt-5 w-full">
                    Enquire about this
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
