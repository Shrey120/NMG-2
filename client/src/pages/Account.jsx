import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import { currentName } from '../auth.js';
import Loading from '../components/Loading.jsx';
import OfferThread, { OfferSummary } from '../components/OfferThread.jsx';

export default function Account() {
  const offers = useLoad('/exchanges/offers/mine');
  const [openId, setOpenId] = useState(null);

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Your account</p>
          <h1 style={{ marginTop: 12 }}>Hello, {currentName()}</h1>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <h2 style={{ fontSize: '1.3rem' }}>Your swap offers</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            Offers you have made on the parts exchange, and the conversation with
            the workshop about each one.
          </p>

          {offers.loading ? (
            <Loading />
          ) : (offers.data || []).length === 0 ? (
            <div className="empty" style={{ marginTop: 24 }}>
              <h3>You have not made any offers yet</h3>
              <Link to="/exchange" className="btn btn-outline" style={{ marginTop: 20 }}>
                Browse the exchange
              </Link>
            </div>
          ) : (
            <div className="stack" style={{ marginTop: 24 }}>
              {offers.data.map((offer) => (
                <article key={offer.id} className="card">
                  <div className="card-body">
                    <div className="between" style={{ alignItems: 'flex-start' }}>
                      <div>
                        <span className="badge badge-quiet">{offer.status}</span>
                        <h3 style={{ marginTop: 10 }}>{offer.exchangeTitle}</h3>
                        <OfferSummary offer={offer} />
                      </div>
                      <button
                        className="btn btn-outline btn-small"
                        onClick={() => setOpenId(openId === offer.id ? null : offer.id)}
                      >
                        {openId === offer.id ? 'Hide messages' : 'Messages'}
                      </button>
                    </div>
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
      </section>
    </>
  );
}
