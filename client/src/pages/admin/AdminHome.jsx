import { Link } from 'react-router-dom';
import { useLoad } from '../../useLoad.js';
import { money } from '../../api.js';
import Loading from '../../components/Loading.jsx';

export default function AdminHome() {
  const stats = useLoad('/stats');
  const enquiries = useLoad('/enquiries');

  if (stats.loading) return <Loading />;

  const s = stats.data || {};

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="muted" style={{ marginTop: 6 }}>Overview of listings, enquiries and posts.</p>

      <div className="grid grid-4" style={{ marginTop: 28 }}>
        <Link to="/admin/enquiries" className="stat card-hover">
          <span className="label">Unread enquiries</span>
          <strong>{s.unread}</strong>
          <span className="small muted">{s.enquiries} in total</span>
        </Link>

        <Link to="/admin/listings" className="stat card-hover">
          <span className="label">Parts available</span>
          <strong>{s.available}</strong>
          <span className="small muted">{s.listings} listings</span>
        </Link>

        <div className="stat">
          <span className="label">Stock value</span>
          <strong>{money(s.stockValue || 0)}</strong>
          <span className="small muted">Available parts only</span>
        </div>

        <Link to="/admin/posts" className="stat card-hover">
          <span className="label">Community posts</span>
          <strong>{s.posts}</strong>
          <span className="small muted">Wanted and exchange</span>
        </Link>
      </div>

      {s.pendingReviews > 0 && (
        <div className="card card-body between" style={{ marginTop: 24, alignItems: 'center' }}>
          <div>
            <strong>{s.pendingReviews} testimonial waiting for approval</strong>
            <p className="small muted" style={{ marginTop: 4 }}>
              Reviews submitted through the site stay hidden until approved.
            </p>
          </div>
          <Link to="/admin/reviews" className="btn btn-outline btn-small">Review now</Link>
        </div>
      )}

      <h2 style={{ fontSize: '1.2rem', marginTop: 40, marginBottom: 16 }}>Recent enquiries</h2>

      {enquiries.loading ? (
        <Loading />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
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
