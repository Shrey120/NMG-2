import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import Photo from '../components/Photo.jsx';
import Loading from '../components/Loading.jsx';

export default function Portfolio() {
  const { data, loading } = useLoad('/projects');
  const [filter, setFilter] = useState('All');

  const projects = data || [];

  // Build the filter buttons from whatever categories exist in the data.
  const categories = ['All', ...new Set(projects.map((p) => p.category))];
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Portfolio</p>
          <h1 style={{ marginTop: 12 }}>Builds and restorations</h1>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <div className="row" style={{ marginBottom: 32 }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={filter === category ? 'pill pill-on' : 'pill'}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-3">
              {shown.map((project) => (
                <Link to={`/portfolio/${project.slug}`} key={project.id} className="card">
                  <Photo name={project.title} src={project.image} />
                  <div className="card-body">
                    <div className="row" style={{ gap: 8 }}>
                      <span className="badge badge-quiet">{project.category}</span>
                      <span className="small muted">{project.duration}</span>
                    </div>
                    <h3 style={{ marginTop: 12 }}>{project.title}</h3>
                    <p className="small muted" style={{ marginTop: 8 }}>{project.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
