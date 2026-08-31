import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import { post } from '../api.js';
import { isSignedIn, currentName } from '../auth.js';
import Loading from '../components/Loading.jsx';

// Shows "Tue 2 Sep" rather than "2026-09-02".
function dayLabel(dateText) {
  const date = new Date(`${dateText}T00:00:00`);
  return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function Book() {
  const [params] = useSearchParams();

  const services = useLoad('/services');
  const calendar = useLoad('/availability/calendar?days=28');

  const [serviceId, setServiceId] = useState(params.get('service') || '');
  const [date, setDate] = useState('');
  const [slotTime, setSlotTime] = useState('');

  // Only asked for once a date is chosen.
  const slots = useLoad(date ? `/availability/slots?date=${date}` : '/availability');

  const [form, setForm] = useState({
    name: isSignedIn() ? currentName() : '',
    email: '',
    phone: '',
    vehicle: '',
    notes: '',
  });
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  function chooseDate(nextDate) {
    setDate(nextDate);
    setSlotTime(''); // a slot from the old date must not carry over
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await post('/bookings', { ...form, serviceId, bookingDate: date, slotTime, consent });
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (services.loading || calendar.loading) return <Loading />;

  const bookable = (services.data || []).filter((service) => service.bookable === 1);
  const days = calendar.data || [];

  if (sent) {
    return (
      <div className="page section" style={{ maxWidth: 620 }}>
        <div className="empty">
          <h1 style={{ fontSize: '1.8rem' }}>Request received</h1>
          <p className="muted" style={{ marginTop: 12 }}>
            We have emailed you an acknowledgement.
          </p>
          <div className="card card-body" style={{ marginTop: 20, textAlign: 'left' }}>
            <strong>This booking is not confirmed yet.</strong>
            <p className="small muted" style={{ marginTop: 6 }}>
              It is pending approval by the workshop. You will get another email
              once it has been accepted or declined. The slot is not held in the
              meantime.
            </p>
          </div>
          <Link to="/" className="btn" style={{ marginTop: 24 }}>Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Booking</p>
          <h1 style={{ marginTop: 12 }}>Book a service</h1>
          <p className="muted" style={{ marginTop: 12, maxWidth: 620 }}>
            Choose a service, pick a free slot, and tell us about the car. You do
            not need an account.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="page" style={{ maxWidth: 720 }}>
          <form onSubmit={submit} className="stack">
            {/* Step 1 */}
            <div className="card card-body">
              <span className="eyebrow">Step 1</span>
              <h2 style={{ fontSize: '1.2rem', marginTop: 6 }}>Choose a service</h2>

              <div className="stack" style={{ marginTop: 16 }}>
                {bookable.map((service) => (
                  <label
                    key={service.id}
                    className="swap-box between"
                    style={{
                      cursor: 'pointer',
                      alignItems: 'center',
                      borderColor: String(serviceId) === String(service.id) ? 'var(--black)' : undefined,
                    }}
                  >
                    <span className="row" style={{ gap: 12, flexWrap: 'nowrap' }}>
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={String(serviceId) === String(service.id)}
                        onChange={(event) => setServiceId(event.target.value)}
                        required
                      />
                      <span>
                        <strong>{service.title}</strong>
                        <span className="small muted" style={{ display: 'block' }}>{service.summary}</span>
                      </span>
                    </span>
                    <span className="mono small">{service.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="card card-body">
              <span className="eyebrow">Step 2</span>
              <h2 style={{ fontSize: '1.2rem', marginTop: 6 }}>Pick a date</h2>
              <p className="small muted" style={{ marginTop: 6 }}>
                Days the workshop is closed or fully booked cannot be chosen.
              </p>

              <div className="row" style={{ marginTop: 16 }}>
                {days.map((day) => {
                  const unavailable = !day.open || day.freeCount === 0;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      disabled={unavailable}
                      onClick={() => chooseDate(day.date)}
                      className={day.date === date ? 'pill pill-on' : 'pill'}
                      style={unavailable ? { opacity: 0.35, cursor: 'not-allowed', textDecoration: 'line-through' } : undefined}
                      title={day.open ? `${day.freeCount} slots free` : day.reason}
                    >
                      {dayLabel(day.date)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3 */}
            {date && (
              <div className="card card-body">
                <span className="eyebrow">Step 3</span>
                <h2 style={{ fontSize: '1.2rem', marginTop: 6 }}>Pick a time</h2>

                {slots.loading ? (
                  <Loading />
                ) : !slots.data?.open ? (
                  <p className="small muted" style={{ marginTop: 12 }}>{slots.data?.reason}</p>
                ) : (
                  <div className="row" style={{ marginTop: 16 }}>
                    {slots.data.slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSlotTime(slot.time)}
                        className={slot.time === slotTime ? 'pill pill-on' : 'pill'}
                        style={!slot.available ? { opacity: 0.35, cursor: 'not-allowed', textDecoration: 'line-through' } : undefined}
                        title={slot.reason || 'Available'}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4 */}
            {slotTime && (
              <div className="card card-body stack">
                <div>
                  <span className="eyebrow">Step 4</span>
                  <h2 style={{ fontSize: '1.2rem', marginTop: 6 }}>Your details</h2>
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
                    <label className="label" htmlFor="vehicle">Vehicle</label>
                    <input id="vehicle" className="input" placeholder="Year, make, model" required value={form.vehicle} onChange={update('vehicle')} />
                  </div>
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

                <div className="swap-box">
                  <span className="eyebrow">You are requesting</span>
                  <p style={{ marginTop: 6 }}>
                    <strong>{bookable.find((s) => String(s.id) === String(serviceId))?.title}</strong>
                    {' on '}
                    <strong>{dayLabel(date)}</strong>
                    {' at '}
                    <strong>{slotTime.slice(0, 5)}</strong>
                  </p>
                  <p className="small muted" style={{ marginTop: 6 }}>
                    Sending this does not confirm the booking. The workshop has to
                    accept it first, and you will be emailed either way.
                  </p>
                </div>

                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn btn-block">Request this booking</button>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
