import { useState } from 'react';
import { Link } from 'react-router-dom';
import { postForm } from '../api.js';
import { isSignedIn, currentName } from '../auth.js';
import { business } from '../business.js';

const TYPES = ['General', 'Service', 'Parts', 'Collaboration'];

export default function Contact() {
  const [form, setForm] = useState({
    type: 'General',
    name: isSignedIn() ? currentName() : '',
    email: '',
    phone: '',
    vehicle: '',
    subject: '',
    message: '',
  });
  const [photo, setPhoto] = useState(null);
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await postForm('/enquiries', { ...form, consent }, photo);
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Contact</p>
          <h1 style={{ marginTop: 12 }}>Get in touch</h1>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <div className="with-form">
            {sent ? (
              <div className="empty">
                <h2>Enquiry sent</h2>
                <p className="muted" style={{ marginTop: 10 }}>
                  It has been emailed to the workshop and added to their dashboard.
                </p>

                {!isSignedIn() && (
                  <div className="card card-body" style={{ marginTop: 24, textAlign: 'left' }}>
                    <strong>Want to track this?</strong>
                    <p className="small muted" style={{ marginTop: 6 }}>
                      Creating an account is optional, but it lets you make swap
                      offers and post wanted ads without filling in your details
                      each time.
                    </p>
                    <Link to="/register" className="btn btn-outline btn-small" style={{ marginTop: 12 }}>
                      Create an account
                    </Link>
                  </div>
                )}

                <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => setSent(false)}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="card card-body stack">
                <div>
                  <span className="label">What is this about?</span>
                  <div className="row">
                    {TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, type })}
                        className={form.type === type ? 'pill pill-on' : 'pill'}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-2" style={{ gap: 14 }}>
                  <div>
                    <label className="label" htmlFor="name">Name</label>
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
                    <label className="label" htmlFor="vehicle">Vehicle</label>
                    <input id="vehicle" className="input" placeholder="Year, make, model" value={form.vehicle} onChange={update('vehicle')} />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="subject">Subject</label>
                  <input id="subject" className="input" required value={form.subject} onChange={update('subject')} />
                </div>

                <div>
                  <label className="label" htmlFor="message">Message</label>
                  <textarea id="message" className="input" required value={form.message} onChange={update('message')} />
                </div>

                <div>
                  <label className="label" htmlFor="photo">Photo (optional)</label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="input"
                    onChange={(event) => setPhoto(event.target.files[0] || null)}
                  />
                  <p className="form-note" style={{ marginTop: 6 }}>
                    A photo of the part or the fault often saves a round of questions. Up to 5MB.
                  </p>
                </div>

                <label className="row small" style={{ gap: 10, flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
                  <span>
                    I accept the <Link to="/privacy">privacy policy</Link> and agree to
                    Outlier Autowerke storing these details so they can reply.
                  </span>
                </label>

                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn btn-block">Send enquiry</button>
              </form>
            )}

            <aside className="stack">
              <div className="card card-body">
                <h3>Workshop details</h3>
                <div style={{ marginTop: 12 }}>
                  <div className="detail-row"><span className="muted">Trading name</span><span>{business.name}</span></div>
                  <div className="detail-row"><span className="muted">ABN</span><span className="mono">{business.abn}</span></div>
                  <div className="detail-row"><span className="muted">Location</span><span>{business.suburb}</span></div>
                  <div className="detail-row"><span className="muted">Email</span><span>{business.email}</span></div>
                </div>
              </div>

              <div className="card card-body">
                <h3>Opening hours</h3>
                <div style={{ marginTop: 12 }}>
                  {business.hours.map(([day, hours]) => (
                    <div className="detail-row" key={day}>
                      <span className="muted">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card card-body">
                <h3>Booking a service?</h3>
                <p className="small muted" style={{ marginTop: 8 }}>
                  Use the booking form instead and pick a date directly.
                </p>
                <Link to="/book" className="btn btn-outline btn-block btn-small" style={{ marginTop: 12 }}>
                  Book a service
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
