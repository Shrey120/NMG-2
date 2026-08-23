import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import { postForm, money } from '../api.js';
import Photo from '../components/Photo.jsx';
import { isSignedIn, currentName } from '../auth.js';
import Loading from '../components/Loading.jsx';

function EnquiryForm({ listing }) {
  const [form, setForm] = useState({
    name: isSignedIn() ? currentName() : '',
    email: '',
    phone: '',
    vehicle: '',
    message: '',
  });
  const [photo, setPhoto] = useState(null);
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    try {
      await postForm(
        '/enquiries',
        {
          ...form,
          consent,
          type: 'Parts',
          subject: `Enquiry: ${listing.title}`,
          listingId: listing.id,
        },
        photo
      );
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (sent) {
    return (
      <div className="card card-body center">
        <h3>Enquiry sent</h3>
        <p className="small muted" style={{ marginTop: 8 }}>
          It has been emailed to the workshop and added to their dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card card-body stack">
      <h3>Enquire about this part</h3>
      <input className="input" placeholder="Your name" required value={form.name} onChange={update('name')} aria-label="Your name" />
      <input className="input" type="email" placeholder="Email" required value={form.email} onChange={update('email')} aria-label="Email" />
      <input className="input" placeholder="Phone (optional)" value={form.phone} onChange={update('phone')} aria-label="Phone" />
      <input className="input" placeholder="Your vehicle" value={form.vehicle} onChange={update('vehicle')} aria-label="Your vehicle" />
      <textarea className="input" placeholder="Ask about freight, condition or fitment" value={form.message} onChange={update('message')} aria-label="Message" />

      <div>
        <label className="label" htmlFor="listing-photo">Photo (optional)</label>
        <input
          id="listing-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="input"
          onChange={(event) => setPhoto(event.target.files[0] || null)}
        />
      </div>

      <label className="row small" style={{ gap: 10, flexWrap: 'nowrap', alignItems: 'flex-start' }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
        <span>
          I accept the <Link to="/privacy">privacy policy</Link>.
        </span>
      </label>

      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn btn-block">Send enquiry</button>
      <p className="form-note">No payment is taken on this site. Enquiries are stored for the workshop to answer.</p>
    </form>
  );
}

export default function Listing() {
  const { id } = useParams();
  const { data: listing, loading } = useLoad(`/listings/${id}`);

  if (loading) return <Loading />;

  if (!listing) {
    return (
      <div className="page section">
        <div className="empty">
          <h2>Part not found</h2>
          <Link to="/marketplace" className="btn btn-outline" style={{ marginTop: 20 }}>
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page section">
      <Link to="/marketplace" className="small">&larr; Back to marketplace</Link>

      <div className="grid grid-2" style={{ marginTop: 24, alignItems: 'start' }}>
        <div>
          <Photo name={listing.title} />
          <div className="grid grid-3" style={{ marginTop: 12 }}>
            <Photo name="Detail" className="photo-square" />
            <Photo name="Fitment" className="photo-square" />
            <Photo name="Packaging" className="photo-square" />
          </div>

          <h2 style={{ fontSize: '1.2rem', marginTop: 32 }}>Description</h2>
          <p style={{ marginTop: 10 }}>{listing.description}</p>
        </div>

        <div className="stack">
          <div>
            <div className="row" style={{ gap: 8 }}>
              <span className="badge">{listing.category}</span>
              {listing.status !== 'available' && <span className="badge badge-solid">{listing.status}</span>}
            </div>
            <h1 style={{ fontSize: '2rem', marginTop: 14 }}>{listing.title}</h1>
            <p className="mono" style={{ fontSize: '2rem', fontWeight: 700, marginTop: 12 }}>
              {money(listing.price)}
            </p>
          </div>

          <div className="card card-body">
            <div className="detail-row"><span className="muted">Marque</span><span>{listing.make}</span></div>
            <div className="detail-row"><span className="muted">Fitment</span><span>{listing.fitment}</span></div>
            <div className="detail-row"><span className="muted">Condition</span><span>{listing.itemCondition}</span></div>
            <div className="detail-row"><span className="muted">Part number</span><span className="mono">{listing.partNumber}</span></div>
            <div className="detail-row"><span className="muted">Quantity</span><span>{listing.quantity}</span></div>
            <div className="detail-row"><span className="muted">Listed</span><span>{listing.createdAt}</span></div>
          </div>

          {listing.status === 'available' ? (
            <EnquiryForm listing={listing} />
          ) : (
            <div className="card card-body center">
              <h3>This part is {listing.status}</h3>
              <p className="small muted" style={{ marginTop: 8 }}>
                We may be able to source another one.
              </p>
              <Link to="/wanted" className="btn btn-outline" style={{ marginTop: 16 }}>
                Post a wanted ad
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
