import { useState } from 'react';
import { post } from '../api.js';

const TYPES = ['General', 'Service', 'Parts', 'Collaboration'];

export default function Contact() {
  const [form, setForm] = useState({
    type: 'General',
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    subject: '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await post('/enquiries', form);
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
                  Your message is stored and appears in the admin panel under Enquiries.
                </p>
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

                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn btn-block">Send enquiry</button>
              </form>
            )}

            <aside className="stack">
              <div className="card card-body">
                <h3>Workshop details</h3>
                <div style={{ marginTop: 12 }}>
                  <div className="detail-row"><span className="muted">Email</span><span>hello@outlierautowerke.example</span></div>
                  <div className="detail-row"><span className="muted">Phone</span><span>(07) 5555 0100</span></div>
                  <div className="detail-row"><span className="muted">Location</span><span>Sunshine Coast, QLD</span></div>
                </div>
                <p className="form-note" style={{ marginTop: 12 }}>
                  Placeholder details until the client confirms what to show publicly.
                </p>
              </div>

              <div className="card card-body">
                <h3>Opening hours</h3>
                <div style={{ marginTop: 12 }}>
                  <div className="detail-row"><span className="muted">Mon - Fri</span><span>8:00am - 5:30pm</span></div>
                  <div className="detail-row"><span className="muted">Saturday</span><span>9:00am - 1:00pm</span></div>
                  <div className="detail-row"><span className="muted">Sunday</span><span>Closed</span></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
