import { Link } from 'react-router-dom';
import { useLoad } from '../../useLoad.js';
import { money } from '../../api.js';
import Loading from '../../components/Loading.jsx';

function Stat({ label, value, note, to }) {
  const inside = (
    <>
      <span className="label">{label}</span>
      <strong>{value}</strong>
      <span className="small muted">{note}</span>
    </>
  );
  return to ? <Link to={to} className="stat card-hover">{inside}</Link> : <div className="stat">{inside}</div>;
}

export default function AdminHome() {
  const stats = useLoad('/stats');
  const enquiries = useLoad('/enquiries');

  if (stats.loading) return <Loading />;
  const s = stats.data || {};

  // Anything waiting on a person is gathered into one list.
  const waiting = [
    { count: s.unread, label: 'enquiries unread', to: '/admin/enquiries' },
    { count: s.pendingBookings, label: 'bookings to confirm', to: '/admin/bookings' },
    { count: s.pendingOffers, label: 'swap offers to answer', to: '/admin/offers' },
    { count: s.pendingWanted, label: 'wanted ads to approve', to: '/admin/posts' },
    { count: s.pendingReviews, label: 'testimonials to approve', to: '/admin/reviews' },
  ].filter((item) => item.count > 0);

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="muted" style={{ marginTop: 6 }}>Everything that needs attention, in one place.</p>

      {waiting.length > 0 && (
        <div className="card card-body" style={{ marginTop: 24 }}>
          <strong>Needs you</strong>
          <div className="row" style={{ marginTop: 12 }}>
            {waiting.map((item) => (
              <Link key={item.label} to={item.to} className="pill">
                {item.count} {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-4" style={{ marginTop: 24 }}>
        <Stat label="Parts available" value={s.available} note={`${s.listings} listings`} to="/admin/listings" />
        <Stat label="Stock value" value={money(s.stockValue || 0)} note="Available parts only" />
        <Stat label="Bookings" value={s.bookings} note={`${s.pendingBookings} to confirm`} to="/admin/bookings" />
        <Stat label="Swap offers" value={s.offers} note={`${s.pendingOffers} pending`} to="/admin/offers" />
      </div>

      <h2 style={{ fontSize: '1.2rem', marginTop: 40, marginBottom: 16 }}>Recent enquiries</h2>

      {enquiries.loading ? (
        <Loading />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Subject</th><th>Type</th><th>Status</th></tr>
            </thead>
            <tbody>
              {(enquiries.data || []).slice(0, 5).map((enquiry) => (
                <tr key={enquiry.id}>
                  <td>{enquiry.name}</td>
                  <td>{enquiry.subject}</td>
                  <td className="muted">{enquiry.type}</td>
                  <td>{enquiry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
