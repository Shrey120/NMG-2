import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Portfolio from './pages/Portfolio.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Marketplace from './pages/Marketplace.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import PartsWanted from './pages/PartsWanted.jsx';
import PartsExchange from './pages/PartsExchange.jsx';
import Collaborate from './pages/Collaborate.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ManageListings from './pages/admin/ManageListings.jsx';
import ManageEnquiries from './pages/admin/ManageEnquiries.jsx';
import ManagePosts from './pages/admin/ManagePosts.jsx';
import ManageTestimonials from './pages/admin/ManageTestimonials.jsx';

const isAuthed = () => Boolean(localStorage.getItem('oa_token'));

function Protected({ children }) {
  return isAuthed() ? children : <Navigate to="/admin" replace />;
}

const publicPage = (element) => <Layout>{element}</Layout>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={publicPage(<Home />)} />
      <Route path="/services" element={publicPage(<Services />)} />
      <Route path="/portfolio" element={publicPage(<Portfolio />)} />
      <Route path="/portfolio/:slug" element={publicPage(<ProjectDetail />)} />
      <Route path="/marketplace" element={publicPage(<Marketplace />)} />
      <Route path="/marketplace/:id" element={publicPage(<ListingDetail />)} />
      <Route path="/parts-wanted" element={publicPage(<PartsWanted />)} />
      <Route path="/parts-exchange" element={publicPage(<PartsExchange />)} />
      <Route path="/collaborate" element={publicPage(<Collaborate />)} />
      <Route path="/contact" element={publicPage(<Contact />)} />

      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <Protected>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="listings" element={<ManageListings />} />
                <Route path="enquiries" element={<ManageEnquiries />} />
                <Route path="posts" element={<ManagePosts />} />
                <Route path="testimonials" element={<ManageTestimonials />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </Protected>
        }
      />

      <Route path="*" element={publicPage(<NotFound />)} />
    </Routes>
  );
}
