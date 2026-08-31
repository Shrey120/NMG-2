import { useState } from 'react';
import { useLoad } from '../../useLoad.js';
import { patch } from '../../api.js';
import Loading from '../../components/Loading.jsx';

// The four statuses named in the requirements document.
const FILTERS = ['All', 'Pending', 'Accepted', 'Declined', 'Cancelled'];

export default function AdminBookings() {
  const { data, loading, reload } = useLoad('/bookings');
  const [filter, setFilter] = useState('Pending');
  const [message, setMessage] = useState('');

  async function decide(booking, status) {
    setMessage('');
    try {
      const result = await patch(`/bookings/${booking.id}`, { status });
      setMessage(result.message);
      reload();
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (loading) return <Loading />;

  const bookings = data || [];
  const shown = filter === 'All' ? bookings : bookings.filter((b) => b.status === filter);
  const count = (status) => bookings.filter((b) => b.status === status).length;

  return (
    <div>
      <h1>Bookings</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Accepting a booking reserves the slot and emails the customer. Declining
        emails them too and leaves the slot open.
      </p>

      <div className="row" style={{ margin: '24px 0' }}>
        {FILTERS.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={filter === option ? 'pill pill-on' : 'pill'}
          >
            {option} ({option === 'All' ? bookings.length : count(option)})
          </button>
        ))}
      </div>

      {message && (
        <div className="card card-body" style={{ marginBottom: 20 }}>
          <strong>{message}</strong>
        </div>
      )}

      {shown.length === 0 ? (
        <div className="empty"><h3>Nothing here</h3></div>
      ) : (
        <div className="stack">
          {shown.map((booking) => (
            <article key={booking.id} className="card card-body">
              <div className="between" style={{ alignItems: 'flex-start' }}>
                <div>
                  <div className="row" style={{ gap: 8 }}>
                    <span className={booking.status === 'Pending' ? 'badge badge-solid' : 'badge badge-quiet'}>
                      {booking.status}
                    </span>
                    <span className="badge badge-quiet">{booking.serviceTitle}</span>
                  </div>

                  <h3 style={{ marginTop: 10 }}>{booking.name} - {booking.vehicle}</h3>
                  <p className="small muted" style={{ marginTop: 4 }}>
                    {booking.email}{booking.phone && ` - ${booking.phone}`}
                  </p>
                  {booking.notes && <p className="small" style={{ marginTop: 10 }}>{booking.notes}</p>}
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className="label">Slot</span>
                  <strong className="mono" style={{ display: 'block' }}>{booking.bookingDate}</strong>
                  <strong className="mono">{String(booking.slotTime).slice(0, 5)}</strong>
                </div>
              </div>

              <div className="row" style={{ marginTop: 16 }}>
                {booking.status === 'Pending' && (
                  <>
                    <button className="btn btn-small" onClick={() => decide(booking, 'Accepted')}>
                      Accept
                    </button>
                    <button className="btn btn-outline btn-small" onClick={() => decide(booking, 'Declined')}>
                      Decline
                    </button>
                  </>
                )}

                {booking.status === 'Accepted' && (
                  <button className="btn btn-outline btn-small" onClick={() => decide(booking, 'Cancelled')}>
                    Cancel booking
                  </button>
                )}

                <a
                  className="btn btn-outline btn-small"
                  href={`mailto:${booking.email}?subject=Your booking with Outlier Autowerke`}
                >
                  Email customer
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
