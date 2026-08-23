import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Project from './pages/Project.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Listing from './pages/Listing.jsx';
import Wanted from './pages/Wanted.jsx';
import Exchange from './pages/Exchange.jsx';
import Collaborate from './pages/Collaborate.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

import Login from './pages/admin/Login.jsx';
import AdminHome from './pages/admin/AdminHome.jsx';
import AdminListings from './pages/admin/AdminListings.jsx';
import AdminEnquiries from './pages/admin/AdminEnquiries.jsx';
import AdminPosts from './pages/admin/AdminPosts.jsx';
import AdminReviews from './pages/admin/AdminReviews.jsx';
import AdminMenu from './pages/admin/AdminMenu.jsx';

// The public pages all share the same header and footer.
function Site({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// Admin pages share the sidebar, and you have to be signed in to see them.
function Admin({ children }) {
  if (!localStorage.getItem('token')) return <Navigate to="/admin" replace />;

  return (
    <div className="admin">
      <AdminMenu />
      <div className="admin-main">{children}</div>
    </div>
  );
}

// Start at the top of the page whenever the route changes.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Site><Home /></Site>} />
        <Route path="/services" element={<Site><Services /></Site>} />
        <Route path="/portfolio" element={<Site><Portfolio /></Site>} />
        <Route path="/portfolio/:slug" element={<Site><Project /></Site>} />
        <Route path="/marketplace" element={<Site><Marketplace /></Site>} />
        <Route path="/marketplace/:id" element={<Site><Listing /></Site>} />
        <Route path="/wanted" element={<Site><Wanted /></Site>} />
        <Route path="/exchange" element={<Site><Exchange /></Site>} />
        <Route path="/collaborate" element={<Site><Collaborate /></Site>} />
        <Route path="/contact" element={<Site><Contact /></Site>} />

        <Route path="/admin" element={<Login />} />
        <Route path="/admin/home" element={<Admin><AdminHome /></Admin>} />
        <Route path="/admin/listings" element={<Admin><AdminListings /></Admin>} />
        <Route path="/admin/enquiries" element={<Admin><AdminEnquiries /></Admin>} />
        <Route path="/admin/posts" element={<Admin><AdminPosts /></Admin>} />
        <Route path="/admin/reviews" element={<Admin><AdminReviews /></Admin>} />

        <Route path="*" element={<Site><NotFound /></Site>} />
      </Routes>
    </>
  );
}
