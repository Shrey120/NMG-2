import { Link } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import { money } from '../api.js';
import Photo from '../components/Photo.jsx';
import Loading from '../components/Loading.jsx';

export default function Home() {
  const services = useLoad('/services');
  const projects = useLoad('/projects');
  const market = useLoad('/listings?sort=newest');
  const reviews = useLoad('/testimonials');

  const featured = (projects.data || []).filter((p) => p.featured).slice(0, 3);
  const parts = (market.data?.listings || []).filter((l) => l.status === 'available').slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="hero invert">
        <div className="page">
          <p className="eyebrow muted">Sunshine Coast - European specialists</p>
          <h1 style={{ marginTop: 16 }}>European performance, built properly.</h1>
          <p className="muted">
            Tuning, engine building and restoration for cars that deserve better than a generic
            service. Plus a marketplace for the parts everyone else says are discontinued.
          </p>
          <div className="row">
            <Link to="/contact" className="btn">Book a consultation</Link>
            <Link to="/marketplace" className="btn btn-outline">Browse parts</Link>
          </div>

          <div className="hero-stats">
            <div><strong>12+</strong><span>Years in the trade</span></div>
            <div><strong>180+</strong><span>Builds delivered</span></div>
            <div><strong>4.9</strong><span>Average rating</span></div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="page">
          <div className="section-head between">
            <div>
              <p className="eyebrow">What we do</p>
              <h2>Workshop services</h2>
            </div>
            <Link to="/services" className="btn btn-outline btn-small">All services</Link>
          </div>

          {services.loading ? (
            <Loading />
          ) : (
            <div className="grid grid-3">
              {(services.data || []).map((service) => (
                <Link to="/services" key={service.id} className="card">
                  <div className="card-body">
                    <h3>{service.title}</h3>
                    <p className="small muted" style={{ marginTop: 8 }}>{service.summary}</p>
                    <p className="small mono" style={{ marginTop: 14 }}>{service.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Portfolio */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="page">
          <div className="section-head between">
            <div>
              <p className="eyebrow">Recent work</p>
              <h2>Selected builds</h2>
            </div>
            <Link to="/portfolio" className="btn btn-outline btn-small">Full portfolio</Link>
          </div>

          {projects.loading ? (
            <Loading />
          ) : (
            <div className="grid grid-3">
              {featured.map((project) => (
                <Link to={`/portfolio/${project.slug}`} key={project.id} className="card">
                  <Photo name={project.title} />
                  <div className="card-body">
                    <span className="badge badge-quiet">{project.category}</span>
                    <h3 style={{ marginTop: 12 }}>{project.title}</h3>
                    <p className="small muted" style={{ marginTop: 8 }}>{project.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Marketplace */}
      <section className="section">
        <div className="page">
          <div className="section-head between">
            <div>
              <p className="eyebrow">Marketplace</p>
              <h2>Parts in stock</h2>
            </div>
            <Link to="/marketplace" className="btn btn-outline btn-small">Browse all</Link>
          </div>

          {market.loading ? (
            <Loading />
          ) : (
            <div className="grid grid-4">
              {parts.map((part) => (
                <Link to={`/marketplace/${part.id}`} key={part.id} className="card">
                  <Photo name={part.title} />
                  <div className="card-body">
                    <p className="small muted">{part.category}</p>
                    <h3 style={{ fontSize: '0.95rem', marginTop: 6 }}>{part.title}</h3>
                    <p className="mono" style={{ marginTop: 12, fontWeight: 700 }}>{money(part.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="grid grid-2" style={{ marginTop: 24 }}>
            <Link to="/wanted" className="card card-body">
              <h3>Parts Wanted</h3>
              <p className="small muted" style={{ marginTop: 6 }}>Chasing something specific? Post it here.</p>
            </Link>
            <Link to="/exchange" className="card card-body">
              <h3>Parts Exchange</h3>
              <p className="small muted" style={{ marginTop: 6 }}>Have something to trade? List a swap.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="page">
          <div className="section-head">
            <p className="eyebrow">Success stories</p>
            <h2>What customers say</h2>
          </div>

          {reviews.loading ? (
            <Loading />
          ) : (
            <div className="grid grid-3">
              {(reviews.data || []).slice(0, 3).map((review) => (
                <figure key={review.id} className="card card-body">
                  <div aria-label={`${review.rating} out of 5`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  <blockquote className="small" style={{ marginTop: 14 }}>{review.quote}</blockquote>
                  <figcaption className="small" style={{ marginTop: 16, paddingTop: 14, borderTop: 'var(--border)' }}>
                    <strong>{review.name}</strong>
                    <div className="muted">{review.vehicle}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to action */}
      <section className="section invert">
        <div className="page center">
          <h2>Got a project in mind?</h2>
          <p className="muted" style={{ margin: '12px auto 28px', maxWidth: 520 }}>
            Tell us what the car is and what you want from it. We will tell you honestly whether we
            are the right workshop for the job.
          </p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link to="/contact" className="btn">Start an enquiry</Link>
            <Link to="/collaborate" className="btn btn-outline">Partner with us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
