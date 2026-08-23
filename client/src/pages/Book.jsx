import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import { post } from '../api.js';
import { isSignedIn, currentName } from '../auth.js';
import Loading from '../components/Loading.jsx';

export default function Book() {
  const [params] = useSearchParams();
  const services = useLoad('/services');

  const [form, setForm] = useState({
    serviceId: params.get('service') || '',
    name: isSignedIn() ? currentName() : '',
    email: '',
    phone: '',
    vehicle: '',
    preferredDate: '',
    notes: '',
  });
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await post('/bookings', { ...form, consent });
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (services.loading) return <Loading />;

  const bookable = (services.data || []).filter((service) => service.bookable === 1);

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Booking</p>
          <h1 style={{ marginTop: 12 }}>Book a service</h1>
          <p className="muted" style={{ marginTop: 12, maxWidth: 620 }}>
            Pick a service and a date that suits you. We will confirm by email.
            You do not need an account to book.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="page" style={{ maxWidth: 640 }}>
          {sent ? (
            <div className="empty">
              <h2>Booking requested</h2>
              <p className="muted" style={{ marginTop: 10 }}>
                This is a request, not a confirmed appointment. The workshop will
                be in touch to confirm the date.
              </p>
              <Link to="/" className="btn" style={{ marginTop: 20 }}>Back to home</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="card card-body stack">
              <div>
                <label className="label" htmlFor="serviceId">Service</label>
                <select id="serviceId" className="input" required value={form.serviceId} onChange={update('serviceId')}>
                  <option value="">Choose a service</option>
                  {bookable.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title} - {service.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-2" style={{ gap: 14 }}>
                <div>
                  <label className="label" htmlFor="name">Your name</label>
                  <input id="name" className="input" required value={form.name} onChange={update('name')} />
                </div>
                <div>
                  <label className="label" htmlFor="email">Email</label>
                  <input id="email" type="email" className="input" required value={form.email} onChange={update('email')} />
                </div>
                <div>
                  <label className="label" htmlFor="phone">Phone</label>
                  <input id="phone" className="input" value={form.phone} onChange={update('phone')} />
                </div>
                <div>
                  <label className="label" htmlFor="preferredDate">Preferred date</label>
                  <input id="preferredDate" type="date" className="input" required value={form.preferredDate} onChange={update('preferredDate')} />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="vehicle">Vehicle</label>
                <input id="vehicle" className="input" placeholder="Year, make, model" required value={form.vehicle} onChange={update('vehicle')} />
              </div>

              <div>
                <label className="label" htmlFor="notes">What needs doing?</label>
                <textarea id="notes" className="input" value={form.notes} onChange={update('notes')} />
              </div>

              <label className="row small" style={{ gap: 10, flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
                <span>
                  I accept the <Link to="/privacy">privacy policy</Link> and agree to
                  Outlier Autowerke storing these details to arrange my booking.
                </span>
              </label>

              {error && <p className="error">{error}</p>}
              <button type="submit" className="btn btn-block">Request booking</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
