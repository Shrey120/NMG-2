import { NavLink, Link, useNavigate } from 'react-router-dom';

const LINKS = [
  { to: '/admin/home', label: 'Dashboard' },
  { to: '/admin/listings', label: 'Parts listings' },
  { to: '/admin/enquiries', label: 'Enquiries' },
  { to: '/admin/posts', label: 'Wanted & Exchange' },
  { to: '/admin/reviews', label: 'Testimonials' },
];

export default function AdminMenu() {
  const navigate = useNavigate();

  function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/admin');
  }

  return (
    <nav className="sidebar">
      <Link to="/" className="logo" style={{ padding: '4px 12px 16px' }}>
        <span className="logo-mark">OA</span>
        <span className="logo-text">OUTLIER<small>ADMIN</small></span>
      </Link>

      {LINKS.map((link) => (
        <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'on' : '')}>
          {link.label}
        </NavLink>
      ))}

      <div className="sidebar-foot">
        <p className="small muted">{localStorage.getItem('name')}</p>
        <button className="link-button small" onClick={signOut} style={{ marginTop: 6 }}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
