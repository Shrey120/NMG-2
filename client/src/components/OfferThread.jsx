import { useState } from 'react';
import { useLoad } from '../useLoad.js';
import { post, money } from '../api.js';
import Loading from './Loading.jsx';

// The back and forth on a single swap offer. Used by the customer on their
// account page and by staff in the admin panel, so it lives in one file.
export default function OfferThread({ offerId }) {
  const { data, loading, reload } = useLoad(`/exchanges/offers/${offerId}/messages`);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  if (loading) return <Loading />;
  if (!data) return <p className="small muted">Could not load this conversation.</p>;

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    await post(`/exchanges/offers/${offerId}/messages`, { body });
    setBody('');
    setSending(false);
    reload();
  }

  return (
    <div>
      <div className="stack" style={{ marginBottom: 16 }}>
        {data.messages.length === 0 && <p className="small muted">No messages yet.</p>}

        {data.messages.map((message) => {
          // Workshop replies are shown filled in, so the two sides of the
          // conversation are easy to tell apart without using colour.
          const fromWorkshop = message.senderRole !== 'CUSTOMER';
          return (
            <div
              key={message.id}
              className="swap-box"
              style={
                fromWorkshop
                  ? { background: 'var(--black)', color: 'var(--white)', borderColor: 'var(--black)' }
                  : undefined
              }
            >
              <div className="between" style={{ alignItems: 'center' }}>
                <strong className="small">{fromWorkshop ? 'Outlier Autowerke' : message.senderName}</strong>
                <span className="small mono" style={{ opacity: 0.6 }}>
                  {message.createdAt.replace('T', ' ').slice(0, 16)}
                </span>
              </div>
              <p className="small" style={{ marginTop: 6 }}>{message.body}</p>
            </div>
          );
        })}
      </div>

      <form onSubmit={submit} className="row" style={{ flexWrap: 'nowrap' }}>
        <input
          className="input"
          placeholder="Write a reply"
          required
          value={body}
          onChange={(event) => setBody(event.target.value)}
          aria-label="Write a reply"
        />
        <button type="submit" className="btn" disabled={sending}>
          {sending ? 'Sending' : 'Send'}
        </button>
      </form>
    </div>
  );
}

// Small summary line describing what was offered, shared by both screens.
export function OfferSummary({ offer }) {
  const cash = Number(offer.cashAdjustment);
  return (
    <p className="small" style={{ marginTop: 6 }}>
      {offer.offering}
      {cash > 0 && <> plus <strong>{money(cash)}</strong> cash</>}
      {cash < 0 && <> and asking <strong>{money(Math.abs(cash))}</strong> back</>}
    </p>
  );
}
