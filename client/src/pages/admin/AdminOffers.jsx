import { useState } from 'react';
import { useLoad } from '../../useLoad.js';
import { patch } from '../../api.js';
import Loading from '../../components/Loading.jsx';
import OfferThread, { OfferSummary } from '../../components/OfferThread.jsx';

export default function AdminOffers() {
  const { data, loading, reload } = useLoad('/exchanges/offers/all');
  const [openId, setOpenId] = useState(null);

  async function setStatus(offer, status) {
    await patch(`/exchanges/offers/${offer.id}`, { status });
    reload();
  }

  if (loading) return <Loading />;
  const offers = data || [];

  return (
    <div>
      <h1>Swap offers</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Offers customers have made against exchange items, with the negotiation
        on each one.
      </p>

      {offers.length === 0 ? (
        <div className="empty" style={{ marginTop: 24 }}><h3>No offers yet</h3></div>
      ) : (
        <div className="stack" style={{ marginTop: 24 }}>
          {offers.map((offer) => (
            <article key={offer.id} className="card">
              <div className="card-body">
                <div className="between" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div className="row" style={{ gap: 8 }}>
                      <span className="badge badge-quiet">{offer.status}</span>
                      <span className="small muted">{offer.createdAt.replace('T', ' ').slice(0, 16)}</span>
                    </div>
                    <h3 style={{ marginTop: 10 }}>{offer.exchangeTitle}</h3>
                    <p className="small muted" style={{ marginTop: 4 }}>
                      From {offer.customerName} - {offer.customerEmail}
                    </p>
                    <OfferSummary offer={offer} />
                  </div>

                  <button
                    className="btn btn-outline btn-small"
                    onClick={() => setOpenId(openId === offer.id ? null : offer.id)}
                  >
                    {openId === offer.id ? 'Hide' : 'Open'}
                  </button>
                </div>

                {offer.status === 'pending' && (
                  <div className="row" style={{ marginTop: 16 }}>
                    <button className="btn btn-small" onClick={() => setStatus(offer, 'accepted')}>Accept</button>
                    <button className="btn btn-outline btn-small" onClick={() => setStatus(offer, 'declined')}>Decline</button>
                  </div>
                )}
              </div>

              {openId === offer.id && (
                <div className="card-body" style={{ borderTop: 'var(--border)' }}>
                  <OfferThread offerId={offer.id} />
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
