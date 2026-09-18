import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AdminMenu from './pages/admin/AdminMenu.jsx';
import { isSignedIn, isStaff, isAdmin } from './auth.js';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Book from './pages/Book.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Project from './pages/Project.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Listing from './pages/Listing.jsx';
import Wanted from './pages/Wanted.jsx';
import Exchange from './pages/Exchange.jsx';
import ExchangeItem from './pages/ExchangeItem.jsx';
import Collaborate from './pages/Collaborate.jsx';
import Contact from './pages/Contact.jsx';
import SignIn from './pages/SignIn.jsx';
import Register from './pages/Register.jsx';
import Account from './pages/Account.jsx';
import { Privacy, Terms, MarketplaceTerms } from './pages/Policies.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminHome from './pages/admin/AdminHome.jsx';
import AdminListings from './pages/admin/AdminListings.jsx';
import AdminEnquiries from './pages/admin/AdminEnquiries.jsx';
import AdminBookings from './pages/admin/AdminBookings.jsx';
import AdminOffers from './pages/admin/AdminOffers.jsx';
import AdminPosts from './pages/admin/AdminPosts.jsx';
import AdminReviews from './pages/admin/AdminReviews.jsx';
import AdminServices from './pages/admin/AdminServices.jsx';
import AdminProjects from './pages/admin/AdminProjects.jsx';
import AdminBusiness from './pages/admin/AdminBusiness.jsx';
import AdminAvailability from './pages/admin/AdminAvailability.jsx';
import AdminStaff from './pages/admin/AdminStaff.jsx';
import AdminEmails from './pages/admin/AdminEmails.jsx';

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

// Any signed in person can see these.
function SignedIn({ children }) {
  return isSignedIn() ? children : <Navigate to="/signin" replace />;
}

// Staff and administrators share the admin panel.
function Staff({ children }) {
  if (!isSignedIn()) return <Navigate to="/signin" replace />;
  if (!isStaff()) return <Navigate to="/account" replace />;

  return (
    <div className="admin">
      <AdminMenu />
      <div className="admin-main">{children}</div>
    </div>
  );
}

// Only an administrator can change services and portfolio projects.
function AdminOnly({ children }) {
  if (!isAdmin()) return <Navigate to="/admin/home" replace />;
  return <Staff>{children}</Staff>;
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
        <Route path="/book" element={<Site><Book /></Site>} />
        <Route path="/portfolio" element={<Site><Portfolio /></Site>} />
        <Route path="/portfolio/:slug" element={<Site><Project /></Site>} />
        <Route path="/marketplace" element={<Site><Marketplace /></Site>} />
        <Route path="/marketplace/:id" element={<Site><Listing /></Site>} />
        <Route path="/wanted" element={<Site><Wanted /></Site>} />
        <Route path="/exchange" element={<Site><Exchange /></Site>} />
        <Route path="/exchange/:id" element={<Site><ExchangeItem /></Site>} />
        <Route path="/collaborate" element={<Site><Collaborate /></Site>} />
        <Route path="/contact" element={<Site><Contact /></Site>} />

        <Route path="/privacy" element={<Site><Privacy /></Site>} />
        <Route path="/terms" element={<Site><Terms /></Site>} />
        <Route path="/marketplace-terms" element={<Site><MarketplaceTerms /></Site>} />

        <Route path="/signin" element={<Site><SignIn /></Site>} />
        <Route path="/register" element={<Site><Register /></Site>} />
        <Route path="/account" element={<Site><SignedIn><Account /></SignedIn></Site>} />

        {/* /admin on its own used to be the sign in page. */}
        <Route path="/admin" element={<Navigate to="/admin/home" replace />} />
        <Route path="/admin/home" element={<Staff><AdminHome /></Staff>} />
        <Route path="/admin/listings" element={<Staff><AdminListings /></Staff>} />
        <Route path="/admin/enquiries" element={<Staff><AdminEnquiries /></Staff>} />
        <Route path="/admin/bookings" element={<Staff><AdminBookings /></Staff>} />
        <Route path="/admin/availability" element={<Staff><AdminAvailability /></Staff>} />
        <Route path="/admin/offers" element={<Staff><AdminOffers /></Staff>} />
        <Route path="/admin/posts" element={<Staff><AdminPosts /></Staff>} />
        <Route path="/admin/reviews" element={<Staff><AdminReviews /></Staff>} />
        <Route path="/admin/emails" element={<Staff><AdminEmails /></Staff>} />
        <Route path="/admin/services" element={<AdminOnly><AdminServices /></AdminOnly>} />
        <Route path="/admin/projects" element={<AdminOnly><AdminProjects /></AdminOnly>} />
        <Route path="/admin/business" element={<AdminOnly><AdminBusiness /></AdminOnly>} />
        <Route path="/admin/staff" element={<AdminOnly><AdminStaff /></AdminOnly>} />

        <Route path="*" element={<Site><NotFound /></Site>} />
      </Routes>
    </>
  );
}
