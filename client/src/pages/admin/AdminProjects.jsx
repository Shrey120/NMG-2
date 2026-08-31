import { useState } from 'react';
import { useLoad } from '../../useLoad.js';
import { get, post, put, remove, postFile } from '../../api.js';
import Loading from '../../components/Loading.jsx';

const BLANK = {
  title: '', make: '', category: '', year: new Date().getFullYear(),
  duration: '', summary: '', story: '', result: '', featured: 0, workText: '',
};

export default function AdminProjects() {
  const { data, loading, reload } = useLoad('/projects');
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  // The work items live in their own table, so they are fetched with the
  // full project and edited as one line per item.
  async function edit(project) {
    const full = await get(`/projects/${project.slug}`);
    setForm({ ...full, workText: full.work.join('\n') });
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    if (form.id) await put(`/projects/${form.id}`, form);
    else await post('/projects', form);
    setSaving(false);
    setForm(null);
    reload();
  }

  async function uploadImage(project, file) {
    if (!file) return;
    await postFile(`/projects/${project.id}/image`, 'image', file);
    reload();
  }

  async function clearImage(project) {
    await remove(`/projects/${project.id}/image`);
    reload();
  }

  async function deleteProject(project) {
    if (!confirm(`Delete "${project.title}"?`)) return;
    await remove(`/projects/${project.id}`);
    reload();
  }

  return (
    <div>
      <div className="between">
        <div>
          <h1>Portfolio</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            The builds shown on the portfolio pages.
          </p>
        </div>
        {!form && <button className="btn" onClick={() => setForm(BLANK)}>Add project</button>}
      </div>

      {form && (
        <form onSubmit={save} className="card card-body stack" style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: '1.2rem' }}>{form.id ? 'Edit project' : 'New project'}</h2>

          <div>
            <label className="label" htmlFor="p-title">Title</label>
            <input id="p-title" className="input" required value={form.title} onChange={update('title')} />
            <p className="form-note" style={{ marginTop: 6 }}>
              The page address is made from the title automatically.
            </p>
          </div>

          <div className="grid grid-4" style={{ gap: 14 }}>
            <div>
              <label className="label" htmlFor="p-make">Marque</label>
              <input id="p-make" className="input" required value={form.make} onChange={update('make')} />
            </div>
            <div>
              <label className="label" htmlFor="p-category">Category</label>
              <input id="p-category" className="input" required value={form.category} onChange={update('category')} />
            </div>
            <div>
              <label className="label" htmlFor="p-year">Year</label>
              <input id="p-year" type="number" className="input" required value={form.year} onChange={update('year')} />
            </div>
            <div>
              <label className="label" htmlFor="p-duration">Duration</label>
              <input id="p-duration" className="input" placeholder="14 weeks" required value={form.duration} onChange={update('duration')} />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="p-summary">Summary</label>
            <input id="p-summary" className="input" required value={form.summary} onChange={update('summary')} />
          </div>

          <div>
            <label className="label" htmlFor="p-story">The brief</label>
            <textarea id="p-story" className="input" required value={form.story} onChange={update('story')} />
          </div>

          <div>
            <label className="label" htmlFor="p-work">Work carried out</label>
            <textarea id="p-work" className="input" placeholder="One item per line" value={form.workText} onChange={update('workText')} />
            <p className="form-note" style={{ marginTop: 6 }}>One bullet point per line.</p>
          </div>

          <div>
            <label className="label" htmlFor="p-result">Result</label>
            <input id="p-result" className="input" required value={form.result} onChange={update('result')} />
          </div>

          <label className="row small" style={{ gap: 10 }}>
            <input
              type="checkbox"
              checked={Number(form.featured) === 1}
              onChange={(event) => setForm({ ...form, featured: event.target.checked ? 1 : 0 })}
            />
            <span>Show this one on the home page</span>
          </label>

          <div className="row">
            <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" className="btn btn-outline" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="table-wrap" style={{ marginTop: 24 }}>
          <table>
            <thead>
              <tr><th>Project</th><th>Image</th><th>Marque</th><th>Category</th><th>Year</th><th>Home page</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {(data || []).map((project) => (
                <tr key={project.id}>
                  <td><strong>{project.title}</strong></td>
                  <td>
                    {project.image ? (
                      <div className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
                        <img src={`/uploads/${project.image}`} alt="" style={{ width: 56, height: 40, objectFit: 'cover', border: 'var(--border)', borderRadius: 3 }} />
                        <button className="link-button small" onClick={() => clearImage(project)}>Remove</button>
                      </div>
                    ) : (
                      <label className="link-button small" style={{ cursor: 'pointer' }}>
                        Upload
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          style={{ display: 'none' }}
                          onChange={(event) => uploadImage(project, event.target.files[0])}
                        />
                      </label>
                    )}
                  </td>
                  <td className="muted">{project.make}</td>
                  <td className="muted">{project.category}</td>
                  <td>{project.year}</td>
                  <td>{project.featured === 1 ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="link-button small" onClick={() => edit(project)}>Edit</button>
                    {' / '}
                    <button className="link-button small" onClick={() => deleteProject(project)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
