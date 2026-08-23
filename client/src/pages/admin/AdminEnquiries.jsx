import { useState } from 'react';
import { useLoad } from '../../useLoad.js';
import { patch } from '../../api.js';
import Loading from '../../components/Loading.jsx';

const FILTERS = ['all', 'new', 'read', 'replied'];

export default function AdminEnquiries() {
  const { data, loading, reload } = useLoad('/enquiries');
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);

  const enquiries = data || [];
  const shown = filter === 'all' ? enquiries : enquiries.filter((e) => e.status === filter);

  async function setStatus(enquiry, status) {
    await patch(`/enquiries/${enquiry.id}`, { status });
    reload();
  }

  function toggle(enquiry) {
    const opening = openId !== enquiry.id;
    setOpenId(opening ? enquiry.id : null);
    // Opening an unread enquiry marks it as read.
    if (opening && enquiry.status === 'new') setStatus(enquiry, 'read');
  }

  return (
    <div>
      <h1>Enquiries</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Messages from the contact form, part enquiries and partnership requests.
      </p>

      <div className="row" style={{ margin: '24px 0' }}>
        {FILTERS.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={filter === option ? 'pill pill-on' : 'pill'}
          >
            {option} ({option === 'all' ? enquiries.length : enquiries.filter((e) => e.status === option).length})
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : shown.length === 0 ? (
        <div className="empty"><h3>Nothing here</h3></div>
      ) : (
        <div className="stack">
          {shown.map((enquiry) => (
            <article key={enquiry.id} className="card">
              <button
                onClick={() => toggle(enquiry)}
                className="card-body between"
                style={{ width: '100%', background: 'none', border: 0, cursor: 'pointer', textAlign: 'left' }}
              >
                <div>
                  <div className="row" style={{ gap: 8 }}>
                    <strong>{enquiry.name}</strong>
                    <span className="badge badge-quiet">{enquiry.type}</span>
                    <span className="badge badge-quiet">{enquiry.status}</span>
                  </div>
                  <p style={{ marginTop: 6 }}>{enquiry.subject}</p>
                  <p className="small muted">{enquiry.email} {enquiry.phone && `- ${enquiry.phone}`}</p>
                </div>
                <span className="small muted mono">{enquiry.createdAt.slice(0, 10)}</span>
              </button>

              {openId === enquiry.id && (
                <div className="card-body" style={{ borderTop: 'var(--border)' }}>
                  <p>{enquiry.message}</p>
                  {enquiry.vehicle && <p className="small muted" style={{ marginTop: 10 }}>Vehicle: {enquiry.vehicle}</p>}

                  {enquiry.photo && (
                    <div style={{ marginTop: 14 }}>
                      <p className="label">Photo attached</p>
                      <a href={`/uploads/${enquiry.photo}`} target="_blank" rel="noreferrer">
                        <img
                          src={`/uploads/${enquiry.photo}`}
                          alt="Sent with the enquiry"
                          style={{ maxWidth: 260, border: 'var(--border)', borderRadius: 4 }}
                        />
                      </a>
                    </div>
                  )}

                  <div className="row" style={{ marginTop: 20 }}>
                    <a className="btn btn-outline btn-small" href={`mailto:${enquiry.email}?subject=Re: ${enquiry.subject}`}>
                      Reply by email
                    </a>
                    {enquiry.status !== 'replied' && (
                      <button className="btn btn-outline btn-small" onClick={() => setStatus(enquiry, 'replied')}>
                        Mark as replied
                      </button>
                    )}
                    {enquiry.status !== 'new' && (
                      <button className="btn btn-outline btn-small" onClick={() => setStatus(enquiry, 'new')}>
                        Mark unread
                      </button>
                    )}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
