import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/parts-wanted', label: 'Parts Wanted' },
  { to: '/parts-exchange', label: 'Exchange' },
  { to: '/collaborate', label: 'Collaborate' },
];

function DemoBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="border-b border-accent/20 bg-accent/10 px-4 py-2 text-center text-xs text-accent">
      <span className="font-semibold">Prototype</span> — all content, parts and reviews shown are
      sample data for demonstration only.
      <button
        onClick={() => setOpen(false)}
        className="ml-3 underline underline-offset-2 opacity-70 hover:opacity-100"
      >
        dismiss
      </button>
    </div>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded bg-accent font-mono text-sm font-black text-ink">
        OA
      </span>
      <span className="leading-none">
        <span className="block text-sm font-bold tracking-wide">OUTLIER</span>
        <span className="block text-[10px] tracking-[0.2em] text-muted">AUTOWERKE</span>
      </span>
    </Link>
  );
}

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const linkClass = ({ isActive }) =>
    `text-sm transition ${isActive ? 'text-accent' : 'text-muted hover:text-white'}`;

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />

      <header className="sticky top-0 z-50 border-b border-edge bg-ink/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6">
          <Logo />

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-ink transition hover:bg-orange-400 sm:block"
            >
              Get in touch
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded border border-edge lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              <span className="text-lg leading-none">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-edge bg-panel px-4 py-3 lg:hidden">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block border-b border-edge/60 py-3 text-sm last:border-0 ${
                    isActive ? 'text-accent' : 'text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" className="mt-3 block rounded-lg bg-accent py-2.5 text-center text-sm font-semibold text-ink">
              Get in touch
            </Link>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-edge bg-panel">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted">
              European performance specialists — tuning, engine building, restoration and
              hard-to-find parts. Sunshine Coast, Queensland.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm text-muted">
              {NAV.slice(1).map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>hello@outlierautowerke.example</li>
              <li>(07) 5555 0100</li>
              <li>Sunshine Coast, QLD</li>
              <li className="pt-2">
                <Link to="/admin" className="text-xs hover:text-accent">
                  Staff login →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-edge px-4 py-5 text-center text-xs text-muted sm:px-6">
          Prototype build · Sample data throughout · Outlier Autowerke industry project
        </div>
      </footer>
    </div>
  );
}
