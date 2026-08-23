import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { isSignedIn, isStaff, currentName, signOut } from '../auth.js';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/wanted', label: 'Wanted' },
  { to: '/exchange', label: 'Exchange' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);

  const signedIn = isSignedIn();

  function leave() {
    signOut();
    navigate('/');
  }

  // React Router adds "on" to the link for the page you are looking at.
  const linkClass = ({ isActive }) => (isActive ? 'on' : '');

  return (
    <>
      {bannerOpen && (
        <div className="banner">
          Prototype - all content shown is sample data.{' '}
          <button className="link-button" onClick={() => setBannerOpen(false)}>hide</button>
        </div>
      )}

      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">OA</span>
            <span className="logo-text">
              OUTLIER
              <small>AUTOWERKE</small>
            </span>
          </Link>

          <nav className="nav">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="row" style={{ gap: 10, flexWrap: 'nowrap' }}>
            {signedIn ? (
              <>
                <Link
                  to={isStaff() ? '/admin/home' : '/account'}
                  className="btn btn-outline btn-small nav-only"
                >
                  {isStaff() ? 'Admin panel' : currentName().split(' ')[0]}
                </Link>
                <button className="btn btn-small nav-only" onClick={leave}>Sign out</button>
              </>
            ) : (
              <Link to="/signin" className="btn btn-small nav-only">Sign in</Link>
            )}

            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-nav">
            {LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link to="/book" onClick={() => setMenuOpen(false)}>Book a service</Link>

            {signedIn ? (
              <>
                <Link to={isStaff() ? '/admin/home' : '/account'} onClick={() => setMenuOpen(false)}>
                  {isStaff() ? 'Admin panel' : 'My account'}
                </Link>
                <button className="link-button" style={{ padding: '12px 0' }} onClick={leave}>
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/signin" onClick={() => setMenuOpen(false)}>Sign in</Link>
            )}
          </nav>
        )}
      </header>
    </>
  );
}
