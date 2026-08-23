import { Link } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import Loading from '../components/Loading.jsx';

export default function Exchange() {
  const { data, loading } = useLoad('/exchanges');

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Parts Exchange</p>
          <h1 style={{ marginTop: 12 }}>Trade parts, not cash</h1>
          <p className="muted" style={{ marginTop: 12, maxWidth: 620 }}>
            Parts the workshop will swap. Open one, offer a specific part in
            return, and we will talk it through from there.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="page">
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-2">
              {(data || []).map((item) => (
                <Link to={`/exchange/${item.id}`} key={item.id} className="card card-body">
                  <div className="between" style={{ alignItems: 'flex-start' }}>
                    <div className="row" style={{ gap: 8 }}>
                      {item.make && <span className="badge badge-quiet">{item.make}</span>}
                      <span className="badge badge-quiet">{item.status}</span>
                    </div>
                    <span className="small mono muted">{item.createdAt}</span>
                  </div>

                  <h2 style={{ fontSize: '1.15rem', marginTop: 12 }}>{item.title}</h2>

                  <div className="swap" style={{ marginTop: 16 }}>
                    <div className="swap-box">
                      <p className="eyebrow">We have</p>
                      <p className="small" style={{ marginTop: 6 }}>{item.offering}</p>
                    </div>
                    <div className="swap-arrow">&#8644;</div>
                    <div className="swap-box">
                      <p className="eyebrow">We want</p>
                      <p className="small" style={{ marginTop: 6 }}>{item.wanting}</p>
                    </div>
                  </div>

                  <p className="small muted" style={{ marginTop: 14 }}>
                    {item.offerCount} {Number(item.offerCount) === 1 ? 'offer' : 'offers'} so far
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
