import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page section center">
      <h1>404</h1>
      <p className="muted" style={{ marginTop: 12 }}>That page does not exist.</p>
      <Link to="/" className="btn" style={{ marginTop: 24 }}>Back to home</Link>
    </div>
  );
}
