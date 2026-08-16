import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { PageHeader, Thumb, Badge, Loader, Empty } from '../components/ui.jsx';

export default function Portfolio() {
  const { data, loading } = useApi(() => api.projects(), []);
  const [filter, setFilter] = useState('All');

  const projects = data || [];
  const categories = ['All', ...new Set(projects.map((p) => p.category))];
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Builds, restorations and success stories"
        blurb="A selection of completed projects. Each one documented with the scope, the work carried out and the measurable result."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="mb-10 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    filter === c
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-edge text-muted hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {shown.length === 0 ? (
              <Empty title="No projects in this category" />
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((p) => (
                  <Link key={p.id} to={`/portfolio/${p.slug}`} className="group">
                    <Thumb label={p.title} seed={p.id} className="transition group-hover:opacity-80" />
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Badge tone="accent">{p.category}</Badge>
                      <Badge>{p.make}</Badge>
                      <span className="text-xs text-muted">{p.duration}</span>
                    </div>
                    <h2 className="mt-2.5 text-lg font-semibold transition group-hover:text-accent">
                      {p.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-muted">{p.summary}</p>
                    <p className="mt-3 text-sm font-medium text-accent">Read the build →</p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
