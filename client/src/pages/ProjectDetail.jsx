import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { Thumb, Badge, Button, Loader, Empty } from '../components/ui.jsx';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error } = useApi(() => api.project(slug), [slug]);

  if (loading) return <Loader label="Loading project" />;
  if (error || !project)
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <Empty
          title="Project not found"
          blurb="That build does not exist, or the link is out of date."
          action={
            <Button as="link" to="/portfolio" variant="ghost">
              Back to portfolio
            </Button>
          }
        />
      </div>
    );

  return (
    <article className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <Link to="/portfolio" className="text-sm text-muted hover:text-accent">
        ← Back to portfolio
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{project.category}</Badge>
          <Badge>{project.make}</Badge>
          <span className="text-xs text-muted">
            {project.year} · {project.duration}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">{project.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{project.summary}</p>
      </header>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Thumb label={project.title} seed={project.id} ratio="aspect-[16/10]" className="sm:col-span-3" />
        <Thumb label="Before" seed={`${project.id}-b`} ratio="aspect-[4/3]" />
        <Thumb label="During" seed={`${project.id}-d`} ratio="aspect-[4/3]" />
        <Thumb label="After" seed={`${project.id}-a`} ratio="aspect-[4/3]" />
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold">The brief</h2>
          <p className="mt-4 leading-relaxed text-white/80">{project.story}</p>

          <h2 className="mt-10 text-xl font-bold">Work carried out</h2>
          <ul className="mt-4 space-y-3">
            {project.work.map((w) => (
              <li key={w} className="flex gap-3 text-sm text-white/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {w}
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-5">
          <div className="panel p-6">
            <p className="eyebrow mb-3">Result</p>
            <p className="text-sm leading-relaxed text-white/85">{project.result}</p>
          </div>
          <div className="panel p-6">
            <dl className="space-y-3 text-sm">
              {[
                ['Marque', project.make],
                ['Type', project.category],
                ['Completed', project.year],
                ['Duration', project.duration],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-edge pb-3 last:border-0 last:pb-0">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Button as="link" to="/contact" className="w-full">
            Enquire about a similar build
          </Button>
        </aside>
      </div>
    </article>
  );
}
