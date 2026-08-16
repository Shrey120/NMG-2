import { Link } from 'react-router-dom';

// Deterministic placeholder "photo". Real client photography replaces this —
// see question H2 on the Round 1 sheet. Generated locally so the prototype
// works with no network and no image licensing questions.
export function Thumb({ label, seed = '', className = '', ratio = 'aspect-[4/3]' }) {
  const hash = [...(seed + label)].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = hash % 360;
  const initials = label
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`${ratio} ${className} relative overflow-hidden rounded-lg border border-edge grid place-items-center`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 22% 16%), hsl(${(hue + 45) % 360} 28% 9%))`,
      }}
      role="img"
      aria-label={`Placeholder image for ${label}`}
    >
      <div className="absolute inset-0 hatch opacity-60" />
      <span className="relative font-mono text-3xl font-bold tracking-tight text-white/25">
        {initials}
      </span>
      <span className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/40">
        Sample
      </span>
    </div>
  );
}

export function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-panel-2 text-muted border-edge',
    accent: 'bg-accent/10 text-accent border-accent/30',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatusPill({ status }) {
  const map = {
    available: ['green', 'Available'],
    sold: ['red', 'Sold'],
    reserved: ['amber', 'Reserved'],
    open: ['green', 'Open'],
    fulfilled: ['default', 'Fulfilled'],
    traded: ['default', 'Traded'],
    new: ['accent', 'New'],
    read: ['amber', 'Read'],
    replied: ['green', 'Replied'],
  };
  const [tone, label] = map[status] || ['default', status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function Button({ as = 'button', to, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'bg-accent text-ink hover:bg-orange-400',
    ghost: 'border border-edge text-white hover:border-accent hover:text-accent',
    subtle: 'bg-panel-2 text-white hover:bg-edge',
    danger: 'border border-rose-500/40 text-rose-400 hover:bg-rose-500/10',
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  if (as === 'link') return <Link to={to} className={cls} {...props} />;
  return <button className={cls} {...props} />;
}

export function SectionHead({ eyebrow, title, blurb, action }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {blurb && <p className="mt-3 text-muted">{blurb}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ eyebrow, title, blurb, children }) {
  return (
    <section className="relative overflow-hidden border-b border-edge">
      <div className="absolute inset-0 hatch" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        {blurb && <p className="mt-4 max-w-2xl text-muted">{blurb}</p>}
        {children}
      </div>
    </section>
  );
}

export function Loader({ label = 'Loading' }) {
  return (
    <div className="grid place-items-center py-20 text-sm text-muted">
      <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-edge border-t-accent" />
      {label}…
    </div>
  );
}

export function Empty({ title, blurb, action }) {
  return (
    <div className="panel grid place-items-center px-6 py-16 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      {blurb && <p className="mt-2 max-w-md text-sm text-muted">{blurb}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Stars({ n = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < n ? 'text-accent' : 'text-edge'}>
          ★
        </span>
      ))}
    </div>
  );
}
