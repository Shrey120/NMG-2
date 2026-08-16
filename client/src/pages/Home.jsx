import { Link } from 'react-router-dom';
import { api, money } from '../api.js';
import { useApi } from '../useApi.js';
import { Thumb, Badge, Button, SectionHead, Stars, Loader } from '../components/ui.jsx';

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-edge">
      <div className="absolute inset-0 hatch" />
      <div
        className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #ff7a1a, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Sunshine Coast · European specialists</p>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            European performance,
            <br />
            <span className="text-accent">built properly.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Tuning, engine building and restoration for cars that deserve better than a generic
            service. Plus a marketplace for the parts everyone else says are discontinued.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button as="link" to="/contact">
              Book a consultation
            </Button>
            <Button as="link" to="/marketplace" variant="ghost">
              Browse parts →
            </Button>
          </div>

          <dl className="mt-16 grid max-w-lg grid-cols-3 gap-8 border-t border-edge pt-8">
            {[
              ['12+', 'Years in the trade'],
              ['180+', 'Builds delivered'],
              ['4.9', 'Average rating'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-3xl font-bold text-accent">{value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const services = useApi(() => api.services(), []);
  const projects = useApi(() => api.projects(), []);
  const listings = useApi(() => api.listings({ sort: 'newest' }), []);
  const testimonials = useApi(() => api.testimonials(), []);

  const featured = (projects.data || []).filter((p) => p.featured).slice(0, 3);
  const latestParts = (listings.data?.items || []).filter((l) => l.status === 'available').slice(0, 4);

  return (
    <>
      <Hero />

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead
          eyebrow="What we do"
          title="Workshop services"
          blurb="Six core services covering everything from a routine logbook service to a ground-up rebuild."
          action={
            <Button as="link" to="/services" variant="ghost">
              All services
            </Button>
          }
        />
        {services.loading ? (
          <Loader />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(services.data || []).map((s) => (
              <Link
                key={s.id}
                to="/services"
                className="panel group p-6 transition hover:border-accent/50"
              >
                <div className="mb-4 h-1 w-10 rounded bg-accent transition-all group-hover:w-16" />
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.summary}</p>
                <p className="mt-4 font-mono text-xs text-accent">{s.price}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Portfolio */}
      <section className="border-y border-edge bg-panel">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHead
            eyebrow="Recent work"
            title="Selected builds"
            blurb="Every project documented from teardown to handover."
            action={
              <Button as="link" to="/portfolio" variant="ghost">
                Full portfolio
              </Button>
            }
          />
          {projects.loading ? (
            <Loader />
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((p) => (
                <Link key={p.id} to={`/portfolio/${p.slug}`} className="group">
                  <Thumb label={p.title} seed={p.id} className="transition group-hover:opacity-80" />
                  <div className="mt-4 flex items-center gap-2">
                    <Badge tone="accent">{p.category}</Badge>
                    <span className="text-xs text-muted">{p.duration}</span>
                  </div>
                  <h3 className="mt-2 font-semibold transition group-hover:text-accent">{p.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted">{p.summary}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Marketplace */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead
          eyebrow="Marketplace"
          title="Parts in stock"
          blurb="Rotating stock of OEM, NOS and performance parts. Something missing? Post it in Parts Wanted."
          action={
            <Button as="link" to="/marketplace" variant="ghost">
              Browse all
            </Button>
          }
        />
        {listings.loading ? (
          <Loader />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latestParts.map((l) => (
              <Link key={l.id} to={`/marketplace/${l.id}`} className="panel group overflow-hidden">
                <Thumb label={l.title} seed={l.id} ratio="aspect-[5/3]" className="rounded-none border-0 border-b" />
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted">{l.category}</p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold transition group-hover:text-accent">
                    {l.title}
                  </h3>
                  <p className="mt-3 font-mono text-lg font-bold text-accent">{money(l.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Link to="/parts-wanted" className="panel flex items-center justify-between p-6 transition hover:border-accent/50">
            <div>
              <h3 className="font-semibold">Parts Wanted</h3>
              <p className="mt-1 text-sm text-muted">Chasing something specific? Post it here.</p>
            </div>
            <span className="text-2xl text-accent">→</span>
          </Link>
          <Link to="/parts-exchange" className="panel flex items-center justify-between p-6 transition hover:border-accent/50">
            <div>
              <h3 className="font-semibold">Parts Exchange</h3>
              <p className="mt-1 text-sm text-muted">Have something to trade? List a swap.</p>
            </div>
            <span className="text-2xl text-accent">→</span>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-edge bg-panel">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHead eyebrow="Success stories" title="What customers say" />
          {testimonials.loading ? (
            <Loader />
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {(testimonials.data || []).slice(0, 3).map((t) => (
                <figure key={t.id} className="panel bg-ink p-6">
                  <Stars n={t.rating} />
                  <blockquote className="mt-4 text-sm leading-relaxed text-white/85">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-edge pt-4 text-sm">
                    <span className="font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted">{t.vehicle}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="panel relative overflow-hidden px-6 py-14 text-center sm:px-12">
          <div className="absolute inset-0 hatch" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Got a project in mind?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Tell us what the car is and what you want from it. We will tell you honestly whether
              we are the right workshop for the job.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button as="link" to="/contact">
                Start an enquiry
              </Button>
              <Button as="link" to="/collaborate" variant="ghost">
                Partner with us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
