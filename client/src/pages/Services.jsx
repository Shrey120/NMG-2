import { Link } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import Loading from '../components/Loading.jsx';

export default function Services() {
  const { data, loading } = useLoad('/services');

  return (
    <>
      <section className="section-tight invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Services</p>
          <h1 style={{ marginTop: 12 }}>What we do</h1>
          <p className="muted" style={{ marginTop: 14, maxWidth: 620 }}>
            Every job is quoted in writing, photographed as it progresses, and handed back with an
            explanation of what was done and why.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="page">
          {loading ? (
            <Loading />
          ) : (
            <div className="stack">
              {(data || []).map((service, index) => (
                <article key={service.id} className="card card-hover card-body">
                  <div className="between" style={{ alignItems: 'flex-start' }}>
                    <div style={{ flex: '1 1 420px' }}>
                      <span className="mono muted">{String(index + 1).padStart(2, '0')}</span>
                      <h2 style={{ fontSize: '1.4rem', marginTop: 6 }}>{service.title}</h2>
                      <p className="muted" style={{ marginTop: 8 }}>{service.summary}</p>
                      <p className="small" style={{ marginTop: 14 }}>{service.detail}</p>
                    </div>

                    <div style={{ flex: '0 0 200px' }}>
                      <p className="label">Indicative price</p>
                      <p className="mono" style={{ fontSize: '1.3rem', fontWeight: 700 }}>{service.price}</p>
                      <Link to="/contact" className="btn btn-outline btn-block btn-small" style={{ marginTop: 14 }}>
                        Enquire
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="form-note" style={{ marginTop: 24 }}>
            Prices are placeholders until the client confirms them.
          </p>
        </div>
      </section>
    </>
  );
}
