import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/wanted', label: 'Parts Wanted' },
  { to: '/exchange', label: 'Exchange' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const location = useLocation();

  // React Router adds "on" to the link for the page you are looking at.
  const linkClass = ({ isActive }) => (isActive ? 'on' : '');

  return (
    <>
      {bannerOpen && (
        <div className="banner">
          Prototype - all content shown is sample data.{' '}
          <button className="link-button" onClick={() => setBannerOpen(false)}>
            hide
          </button>
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

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile-nav" key={location.pathname}>
            {LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
