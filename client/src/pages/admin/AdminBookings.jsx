import { useLoad } from '../../useLoad.js';
import { patch } from '../../api.js';
import Loading from '../../components/Loading.jsx';

const NEXT_STATUS = {
  requested: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: ['requested'],
};

export default function AdminBookings() {
  const { data, loading, reload } = useLoad('/bookings');

  async function setStatus(booking, status) {
    await patch(`/bookings/${booking.id}`, { status });
    reload();
  }

  if (loading) return <Loading />;
  const bookings = data || [];

  return (
    <div>
      <h1>Service bookings</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Requests made through the website. Confirming one is a note to yourself -
        it does not email the customer yet.
      </p>

      {bookings.length === 0 ? (
        <div className="empty" style={{ marginTop: 24 }}><h3>No bookings yet</h3></div>
      ) : (
        <div className="stack" style={{ marginTop: 24 }}>
          {bookings.map((booking) => (
            <article key={booking.id} className="card card-body">
              <div className="between" style={{ alignItems: 'flex-start' }}>
                <div>
                  <div className="row" style={{ gap: 8 }}>
                    <span className="badge badge-quiet">{booking.status}</span>
                    <span className="badge badge-quiet">{booking.serviceTitle}</span>
                  </div>
                  <h3 style={{ marginTop: 10 }}>{booking.name} - {booking.vehicle}</h3>
                  <p className="small muted" style={{ marginTop: 4 }}>
                    {booking.email}{booking.phone && ` - ${booking.phone}`}
                  </p>
                  {booking.notes && <p className="small" style={{ marginTop: 10 }}>{booking.notes}</p>}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="label">Preferred date</span>
                  <strong className="mono">{booking.preferredDate}</strong>
                </div>
              </div>

              <div className="row" style={{ marginTop: 16 }}>
                {NEXT_STATUS[booking.status].map((status) => (
                  <button key={status} className="btn btn-outline btn-small" onClick={() => setStatus(booking, status)}>
                    Mark {status}
                  </button>
                ))}
                <a className="btn btn-outline btn-small" href={`mailto:${booking.email}?subject=Your booking with Outlier Autowerke`}>
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
