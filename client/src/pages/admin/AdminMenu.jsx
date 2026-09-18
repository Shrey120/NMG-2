import { NavLink, Link, useNavigate } from 'react-router-dom';
import { currentName, currentRole, isAdmin, signOut } from '../../auth.js';

// Staff see the day to day screens. Only an administrator sees the two that
// change what the website says about the business.
const STAFF_LINKS = [
  { to: '/admin/home', label: 'Dashboard' },
  { to: '/admin/listings', label: 'Parts listings' },
  { to: '/admin/enquiries', label: 'Enquiries' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/availability', label: 'Availability' },
  { to: '/admin/offers', label: 'Swap offers' },
  { to: '/admin/posts', label: 'Wanted & Exchange' },
  { to: '/admin/reviews', label: 'Testimonials' },
  { to: '/admin/emails', label: 'Sent emails' },
];

const ADMIN_LINKS = [
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/projects', label: 'Portfolio' },
  { to: '/admin/business', label: 'Business details' },
  { to: '/admin/staff', label: 'Staff accounts' },
];

export default function AdminMenu() {
  const navigate = useNavigate();

  function leave() {
    signOut();
    navigate('/');
  }

  const links = isAdmin() ? [...STAFF_LINKS, ...ADMIN_LINKS] : STAFF_LINKS;

  return (
    <nav className="sidebar">
      <Link to="/" className="logo" style={{ padding: '4px 12px 16px' }}>
        <span className="logo-mark">OA</span>
        <span className="logo-text">OUTLIER<small>{isAdmin() ? 'ADMINISTRATOR' : 'STAFF'}</small></span>
      </Link>

      {links.map((link) => (
        <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'on' : '')}>
          {link.label}
        </NavLink>
      ))}

      <div className="sidebar-foot">
        <p className="small muted">{currentName()}</p>
        <p className="small muted">{currentRole()}</p>
        <button className="link-button small" onClick={leave} style={{ marginTop: 6 }}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
