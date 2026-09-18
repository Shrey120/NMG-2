import { useState } from 'react';
import { useLoad } from '../../useLoad.js';
import Loading from '../../components/Loading.jsx';

// Turns any web address in an email into a link you can click, so the
// owner's Accept and Decline links work straight from this screen.
function withLinks(text) {
  return text.split(/(https?:\/\/\S+)/g).map((part, index) =>
    /^https?:\/\//.test(part) ? (
      <a key={index} href={part} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
        {part}
      </a>
    ) : (
      part
    )
  );
}

export default function AdminEmails() {
  const { data, loading, reload } = useLoad('/emails');
  const [openId, setOpenId] = useState(null);

  if (loading) return <Loading />;
  const emails = data || [];

  return (
    <div>
      <div className="between">
        <div>
          <h1>Sent emails</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            Every email the website has produced. If no mail account is set up
            they are not really sent, but you can read them here and the links
            inside them work.
          </p>
        </div>
        <button className="btn btn-outline btn-small" onClick={reload}>Refresh</button>
      </div>

      {emails.length === 0 ? (
        <div className="empty" style={{ marginTop: 24 }}>
          <h3>No emails yet</h3>
          <p className="small muted" style={{ marginTop: 8 }}>Make a booking or send an enquiry and they appear here.</p>
        </div>
      ) : (
        <div className="stack" style={{ marginTop: 24 }}>
          {emails.map((email) => (
            <article key={email.id} className="card">
              <button
                onClick={() => setOpenId(openId === email.id ? null : email.id)}
                className="card-body between"
                style={{ width: '100%', background: 'none', border: 0, cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ minWidth: 0 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <span className={email.delivered === 1 ? 'badge badge-quiet' : 'badge'}>
                      {email.delivered === 1 ? 'Delivered' : email.error ? 'Failed' : 'Not sent'}
                    </span>
                    <span className="small muted">to {email.toAddress}</span>
                  </div>
                  <p style={{ marginTop: 6 }}><strong>{email.subject}</strong></p>
                </div>
                <span className="small muted mono" style={{ flexShrink: 0 }}>
                  {String(email.createdAt).replace('T', ' ').slice(0, 16)}
                </span>
              </button>

              {openId === email.id && (
                <div className="card-body" style={{ borderTop: 'var(--border)' }}>
                  {email.error && <p className="error" style={{ marginBottom: 14 }}>Could not send: {email.error}</p>}
                  <pre
                    className="small"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', margin: 0 }}
                  >
                    {withLinks(email.body)}
                  </pre>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
