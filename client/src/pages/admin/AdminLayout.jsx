import { NavLink, Link, useNavigate } from 'react-router-dom';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '▤' },
  { to: '/admin/listings', label: 'Parts listings', icon: '⬢' },
  { to: '/admin/enquiries', label: 'Enquiries', icon: '✉' },
  { to: '/admin/posts', label: 'Wanted & Exchange', icon: '⇄' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '★' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('oa_user') || '{}');

  function signOut() {
    localStorage.removeItem('oa_token');
    localStorage.removeItem('oa_user');
    navigate('/admin');
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="border-b border-edge bg-panel lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-5 lg:block">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded bg-accent font-mono text-sm font-black text-ink">
              OA
            </span>
            <span className="leading-none">
              <span className="block text-xs font-bold tracking-wide">OUTLIER</span>
              <span className="block text-[9px] tracking-[0.2em] text-muted">ADMIN</span>
            </span>
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-panel-2 hover:text-white'
                }`
              }
            >
              <span className="w-4 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-edge p-4 lg:mt-auto lg:block">
          <p className="text-xs text-muted">Signed in as</p>
          <p className="truncate text-sm font-medium">{user.name || 'Admin'}</p>
          <button onClick={signOut} className="mt-3 text-xs text-rose-400 hover:underline">
            Sign out
          </button>
          <Link to="/" className="mt-2 block text-xs text-muted hover:text-accent">
            View website →
          </Link>
        </div>
      </aside>

      <div className="flex-1 bg-ink">
        <div className="flex items-center justify-between border-b border-edge px-6 py-4 lg:hidden">
          <span className="text-sm text-muted">{user.name || 'Admin'}</span>
          <button onClick={signOut} className="text-xs text-rose-400">
            Sign out
          </button>
        </div>
        <div className="p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
