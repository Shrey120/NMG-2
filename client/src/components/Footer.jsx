import { Link } from 'react-router-dom';
import { business } from '../business.js';

export default function Footer() {
  return (
    <footer className="footer invert">
      <div className="page">
        <div className="grid grid-4">
          <div>
            <div className="logo">
              <span className="logo-mark" style={{ background: '#fff', color: '#000' }}>OA</span>
              <span className="logo-text">
                OUTLIER
                <small style={{ color: '#a8a8a8' }}>AUTOWERKE</small>
              </span>
            </div>
            <p className="small muted" style={{ marginTop: 16 }}>
              European car specialists. Tuning, engine building, restoration and
              hard to find parts.
            </p>
          </div>

          <div>
            <h4 className="small">Pages</h4>
            <div className="stack small muted" style={{ marginTop: 12 }}>
              <div><Link to="/services">Services</Link></div>
              <div><Link to="/book">Book a service</Link></div>
              <div><Link to="/portfolio">Portfolio</Link></div>
              <div><Link to="/marketplace">Marketplace</Link></div>
              <div><Link to="/collaborate">Collaborate</Link></div>
            </div>
          </div>

          <div>
            <h4 className="small">Parts</h4>
            <div className="stack small muted" style={{ marginTop: 12 }}>
              <div><Link to="/wanted">Parts Wanted</Link></div>
              <div><Link to="/exchange">Parts Exchange</Link></div>
              <div><Link to="/contact">Send an enquiry</Link></div>
              <div><Link to="/signin">Sign in</Link></div>
            </div>
          </div>

          <div>
            <h4 className="small">Business</h4>
            {/* Only the details the client agreed to show publicly:
                trading name, ABN, suburb and email. No phone number. */}
            <div className="stack small muted" style={{ marginTop: 12 }}>
              <div>{business.name}</div>
              <div>ABN {business.abn}</div>
              <div>{business.suburb}</div>
              <div>{business.email}</div>
            </div>

            <div className="stack small muted" style={{ marginTop: 16 }}>
              <div><Link to="/privacy">Privacy policy</Link></div>
              <div><Link to="/terms">Terms of use</Link></div>
              <div><Link to="/marketplace-terms">Marketplace terms</Link></div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          Prototype build - sample data throughout - Outlier Autowerke industry project
        </div>
      </div>
    </footer>
  );
}
