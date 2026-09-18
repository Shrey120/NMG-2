import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLoad } from '../../useLoad.js';
import { put } from '../../api.js';
import Loading from '../../components/Loading.jsx';

export default function AdminBusiness() {
  const { data, loading, reload } = useLoad('/business');
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Copy the loaded details into the form once they arrive.
  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);

  if (loading || !form) return <Loading />;

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    await put('/business', form);
    setSaving(false);
    setSaved(true);
    reload();
  }

  return (
    <div>
      <h1>Business details</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        What the website says about the business. This appears in the footer of
        every page and on the contact page.
      </p>

      <form onSubmit={save} className="card card-body stack" style={{ marginTop: 24, maxWidth: 720 }}>
        <div>
          <label className="label" htmlFor="b-name">Trading name</label>
          <input id="b-name" className="input" required value={form.name} onChange={update('name')} />
        </div>

        <div className="grid grid-2" style={{ gap: 14 }}>
          <div>
            <label className="label" htmlFor="b-abn">ABN</label>
            <input id="b-abn" className="input" required value={form.abn} onChange={update('abn')} />
          </div>
          <div>
            <label className="label" htmlFor="b-suburb">Suburb</label>
            <input id="b-suburb" className="input" required value={form.suburb} onChange={update('suburb')} />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="b-email">Email</label>
          <input id="b-email" type="email" className="input" required value={form.email} onChange={update('email')} />
          <p className="form-note" style={{ marginTop: 6 }}>
            Booking requests and contact form messages are emailed to this
            address. It is also shown publicly on the website.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="b-blurb">Footer description</label>
          <textarea id="b-blurb" className="input" required value={form.blurb} onChange={update('blurb')} />
        </div>

        <div className="card card-body" style={{ background: 'var(--gray-50)' }}>
          <strong>Opening hours have moved</strong>
          <p className="small muted" style={{ marginTop: 6 }}>
            They are set under <Link to="/admin/availability">Availability</Link>,
            because the same hours also decide which slots customers can book.
            Changing them there updates both at once.
          </p>
        </div>

        <div className="row">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          {saved && !saving && <span className="small muted">Saved.</span>}
        </div>
      </form>
    </div>
  );
}
