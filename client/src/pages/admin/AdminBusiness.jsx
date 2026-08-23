import { useState, useEffect } from 'react';
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
    if (data) setForm({ ...data, hours: data.hours.map((line) => ({ ...line })) });
  }, [data]);

  if (loading || !form) return <Loading />;

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  function updateHour(index, field, value) {
    const hours = form.hours.map((line, position) =>
      position === index ? { ...line, [field]: value } : line
    );
    setForm({ ...form, hours });
  }

  function addLine() {
    setForm({ ...form, hours: [...form.hours, { label: '', hours: '' }] });
  }

  function removeLine(index) {
    setForm({ ...form, hours: form.hours.filter((line, position) => position !== index) });
  }

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
            Shown publicly. The client asked for no phone number and no street
            address on the website.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="b-blurb">Footer description</label>
          <textarea id="b-blurb" className="input" required value={form.blurb} onChange={update('blurb')} />
        </div>

        <div>
          <span className="label">Opening hours</span>
          <div className="stack" style={{ marginTop: 8 }}>
            {form.hours.map((line, index) => (
              <div className="row" key={index} style={{ flexWrap: 'nowrap' }}>
                <input
                  className="input"
                  placeholder="Monday to Friday"
                  aria-label="Days"
                  value={line.label}
                  onChange={(event) => updateHour(index, 'label', event.target.value)}
                />
                <input
                  className="input"
                  placeholder="8:00am - 5:30pm"
                  aria-label="Hours"
                  value={line.hours}
                  onChange={(event) => updateHour(index, 'hours', event.target.value)}
                />
                <button type="button" className="link-button small" onClick={() => removeLine(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="btn btn-outline btn-small" style={{ marginTop: 12 }} onClick={addLine}>
            Add a line
          </button>
          <p className="form-note" style={{ marginTop: 8 }}>
            Add a line for anything extra, such as closures over Christmas.
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
