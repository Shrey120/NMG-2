import { useState } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../api.js';
import LoadingButton from '../components/LoadingButton.jsx';

// The three partnership types are fixed marketing copy, so they live here
// rather than in the database.
const AREAS = [
  {
    title: 'Vehicle projects',
    text: 'The collaborations the client is most interested in: rebuilds and restorations taken on together with other workshops, owners or clubs.',
    tags: ['Rebuilds', 'Restorations', 'Long term builds', 'Club projects'],
  },
  {
    title: 'Workshop and trade partners',
    text: 'We take on overflow fabrication, engine building and diagnostic work for other workshops, and we are always open to reciprocal arrangements.',
    tags: ['Machine shops', 'Trimmers', 'Panel and paint', 'Wheel refurbishers'],
  },
  {
    title: 'Parts suppliers and importers',
    text: 'Ongoing relationships with suppliers who can move quickly on hard to find European parts, especially discontinued lines.',
    tags: ['OEM suppliers', 'Dismantlers', 'Freight forwarders', 'Distributors'],
  },
];

export default function Collaborate() {
  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '', message: '' });
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    if (sending) return;
    setError('');
    setSending(true);
    try {
      await post('/enquiries', {
        consent,
        type: 'Collaboration',
        name: form.name,
        email: form.email,
        phone: form.phone,
        vehicle: form.business,
        subject: `Partnership enquiry from ${form.business || form.name}`,
        message: form.message,
      });
      setSent(true);
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  }

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Collaborate</p>
          <h1 style={{ marginTop: 12 }}>Partners and suppliers</h1>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <div className="grid grid-3">
            {AREAS.map((area) => (
              <div key={area.title} className="card card-hover card-body">
                <h3>{area.title}</h3>
                <p className="small muted" style={{ marginTop: 10 }}>{area.text}</p>
                <div className="row" style={{ gap: 6, marginTop: 16 }}>
                  {area.tags.map((tag) => (
                    <span key={tag} className="badge badge-quiet">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <hr className="divider" />

          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div>
              <h2>Start a conversation</h2>
              <p className="muted" style={{ marginTop: 12 }}>
                Tell us who you are and what you are proposing. Trade enquiries usually get a reply
                within a working day.
              </p>
            </div>

            {sent ? (
              <div className="card card-body center">
                <h3>Message received</h3>
                <p className="small muted" style={{ marginTop: 8 }}>
                  Thank you for your enquiry. We will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="card card-body stack">
                <div className="grid grid-2" style={{ gap: 14 }}>
                  <div>
                    <label className="label" htmlFor="c-name">Your name</label>
                    <input id="c-name" className="input" required value={form.name} onChange={update('name')} />
                  </div>
                  <div>
                    <label className="label" htmlFor="c-business">Business</label>
                    <input id="c-business" className="input" value={form.business} onChange={update('business')} />
                  </div>
                  <div>
                    <label className="label" htmlFor="c-email">Email</label>
                    <input id="c-email" type="email" className="input" required value={form.email} onChange={update('email')} />
                  </div>
                  <div>
                    <label className="label" htmlFor="c-phone">Phone</label>
                    <input id="c-phone" className="input" value={form.phone} onChange={update('phone')} />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="c-message">What are you proposing?</label>
                  <textarea id="c-message" className="input" required value={form.message} onChange={update('message')} />
                </div>

                <label className="row small" style={{ gap: 10, flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
                  <span>
                    I accept the <Link to="/privacy">privacy policy</Link>.
                  </span>
                </label>

                {error && <p className="error">{error}</p>}
                <LoadingButton type="submit" className="btn btn-block" loading={sending}>Send enquiry</LoadingButton>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
