import { Link } from 'react-router-dom';
import { useLoad } from '../useLoad.js';

// The client had no existing policies and asked us to include samples.
// These are drafts for the client to react to, written by students, and they
// need a proper review before the site goes live.
function Draft() {
  return (
    <div className="card card-body" style={{ marginBottom: 32 }}>
      <strong>Draft for review</strong>
      <p className="small muted" style={{ marginTop: 6 }}>
        Sample wording prepared for Outlier Autowerke to review and amend. It has
        not been checked by a lawyer and should not be published as it stands.
      </p>
    </div>
  );
}

function Page({ title, children }) {
  const { data } = useLoad('/business');
  const business = data || { name: 'the workshop', email: '' };

  return (
    <>
      <section className="invert">
        <div className="page" style={{ padding: '40px 24px' }}>
          <p className="eyebrow muted">Policy</p>
          <h1 style={{ marginTop: 12 }}>{title}</h1>
        </div>
      </section>
      <section className="section">
        <div className="page" style={{ maxWidth: 720 }}>
          <Draft />
          {children}
          <hr className="divider" />
          <p className="small muted">
            Questions about this policy can go to{' '}
            <a href={`mailto:${business.email}`}>{business.email}</a>, or through the{' '}
            <Link to="/contact">contact form</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

export function Privacy() {
  const { data } = useLoad('/business');
  const business = data || { name: 'the workshop', email: '' };

  return (
    <Page title="Privacy policy">
      <div className="stack">
        <h2 style={{ fontSize: '1.15rem' }}>What we collect</h2>
        <p>
          When you send an enquiry or request a booking we collect your name,
          email address, and optionally your phone number, vehicle details and a
          photo you choose to attach. If you create an account we also store the
          suburb you give us. We collect this so we can answer you, and for no
          other purpose.
        </p>

        <h2 style={{ fontSize: '1.15rem' }}>How it is stored</h2>
        <p>
          Details are stored in a database that only {business.name} staff and
          administrators can reach. Passwords are stored as a one way hash, which
          means nobody at {business.name} can read your password.
        </p>

        <h2 style={{ fontSize: '1.15rem' }}>How long we keep it</h2>
        <p>
          Proposed, and subject to the client accepting it: enquiries and booking
          records are kept for <strong>24 months</strong> and then deleted.
          Account details are kept until you ask us to delete them. Under the
          Australian Privacy Act personal information must be destroyed once it
          is no longer needed for the purpose it was collected for.
        </p>

        <h2 style={{ fontSize: '1.15rem' }}>Who we share it with</h2>
        <p>
          Nobody. We do not sell your details and we do not pass them to third
          parties for marketing.
        </p>

        <h2 style={{ fontSize: '1.15rem' }}>Your choices</h2>
        <p>
          You can ask us what we hold about you, ask for it to be corrected, or
          ask for it to be deleted. Email {business.email} and we will action it.
        </p>
      </div>
    </Page>
  );
}

export function Terms() {
  const { data } = useLoad('/business');
  const business = data || { name: 'the workshop' };

  return (
    <Page title="Terms of use">
      <div className="stack">
        <h2 style={{ fontSize: '1.15rem' }}>Using this website</h2>
        <p>
          You may browse this site, send enquiries, request bookings and, with an
          account, post wanted ads and swap offers. Do not post anything unlawful,
          misleading, or that you do not have the right to sell or trade.
        </p>

        <h2 style={{ fontSize: '1.15rem' }}>Content you post</h2>
        <p>
          Wanted ads and swap offers are checked by {business.name} staff before
          they appear publicly. We may decline or remove anything without giving a
          reason.
        </p>

        <h2 style={{ fontSize: '1.15rem' }}>Accuracy</h2>
        <p>
          Prices, availability and vehicle fitment are given in good faith and can
          change. Confirm fitment with us before buying. Photos on this prototype
          are placeholders, not the actual parts.
        </p>

        <h2 style={{ fontSize: '1.15rem' }}>Bookings</h2>
        <p>
          A booking made here is a request. It is not confirmed until
          {' '}{business.name} contacts you.
        </p>
      </div>
    </Page>
  );
}

export function MarketplaceTerms() {
  const { data } = useLoad('/business');
  const business = data || { name: 'the workshop' };

  return (
    <Page title="Marketplace terms">
      <div className="stack">
        <h2 style={{ fontSize: '1.15rem' }}>Who sells here</h2>
        <p>
          Every part listed for sale is listed by {business.name}. This is not an
          open marketplace and other businesses or individuals cannot list parts
          for sale.
        </p>

        <h2 style={{ fontSize: '1.15rem' }}>How payment works</h2>
        <p>
          No payment is taken through this website. You send an enquiry, we
          confirm availability and freight, and payment is arranged directly with
          us.
        </p>

        <h2 style={{ fontSize: '1.15rem' }}>Returns</h2>
        <p>
          Proposed, and open to the client amending it: parts are sold as
          inspected and described, and are not offered on a change of mind
          return. If a part is not as described, contact us and we will put it
          right. This does not affect your rights under Australian Consumer Law,
          which cannot be excluded.
        </p>

        <h2 style={{ fontSize: '1.15rem' }}>Swaps</h2>
        <p>
          A swap offer is an invitation to negotiate. Nothing is binding until
          both sides agree in writing and the parts have been inspected.
        </p>
      </div>
    </Page>
  );
}
