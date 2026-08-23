import { useParams, Link } from 'react-router-dom';
import { useLoad } from '../useLoad.js';
import Photo from '../components/Photo.jsx';
import Loading from '../components/Loading.jsx';

export default function Project() {
  const { slug } = useParams();
  const { data: project, loading } = useLoad(`/projects/${slug}`);

  if (loading) return <Loading />;

  if (!project) {
    return (
      <div className="page section">
        <div className="empty">
          <h2>Project not found</h2>
          <Link to="/portfolio" className="btn btn-outline" style={{ marginTop: 20 }}>
            Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="page section">
      <Link to="/portfolio" className="small">&larr; Back to portfolio</Link>

      <div className="row" style={{ marginTop: 24, gap: 8 }}>
        <span className="badge">{project.category}</span>
        <span className="badge badge-quiet">{project.make}</span>
        <span className="small muted">{project.year} - {project.duration}</span>
      </div>

      <h1 style={{ marginTop: 16 }}>{project.title}</h1>
      <p className="muted" style={{ marginTop: 12, maxWidth: 640, fontSize: '1.05rem' }}>
        {project.summary}
      </p>

      <div className="grid grid-3" style={{ marginTop: 32 }}>
        <Photo name="Before" />
        <Photo name="During" />
        <Photo name="After" />
      </div>

      <div className="grid grid-2" style={{ marginTop: 48, alignItems: 'start' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem' }}>The brief</h2>
          <p style={{ marginTop: 12 }}>{project.story}</p>

          <h2 style={{ fontSize: '1.3rem', marginTop: 32 }}>Work carried out</h2>
          <ul style={{ marginTop: 12, paddingLeft: 20 }}>
            {project.work.map((item) => (
              <li key={item} style={{ marginBottom: 8 }}>{item}</li>
            ))}
          </ul>
        </div>

        <aside className="stack">
          <div className="card card-body">
            <p className="eyebrow">Result</p>
            <p style={{ marginTop: 10 }}>{project.result}</p>
          </div>

          <div className="card card-body">
            <div className="detail-row"><span className="muted">Marque</span><span>{project.make}</span></div>
            <div className="detail-row"><span className="muted">Type</span><span>{project.category}</span></div>
            <div className="detail-row"><span className="muted">Completed</span><span>{project.year}</span></div>
            <div className="detail-row"><span className="muted">Duration</span><span>{project.duration}</span></div>
          </div>

          <Link to="/contact" className="btn btn-block">Enquire about a similar build</Link>
        </aside>
      </div>
    </article>
  );
}
