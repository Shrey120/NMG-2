import { useState } from 'react';
import { useLoad } from '../../useLoad.js';
import { post, remove } from '../../api.js';
import Loading from '../../components/Loading.jsx';

export default function AdminStaff() {
  const { data, loading, reload } = useLoad('/staff');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function run(action) {
    setMessage('');
    try {
      const result = await action();
      setMessage(result.message || 'Done.');
      reload();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function addStaff(event) {
    event.preventDefault();
    setError('');
    try {
      await post('/staff', form);
      setMessage(`${form.name} added. They can sign in now.`);
      setForm({ name: '', email: '', password: '' });
      reload();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;

  const people = data || [];
  const active = people;

  return (
    <div>
      <h1>Staff accounts</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        Everyone with access to the admin panel. People can sign up as staff
        themselves, and you get an email when they do. Nobody can sign up as an
        administrator.
      </p>

      {message && (
        <div className="card card-body" style={{ marginTop: 20 }}>
          <strong>{message}</strong>
        </div>
      )}

      <h2 style={{ fontSize: '1.15rem', margin: '32px 0 14px' }}>Current staff ({active.length})</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr>
          </thead>
          <tbody>
            {active.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td className="muted">{person.email}</td>
                <td>{person.role === 'ADMIN' ? 'Administrator' : 'Staff'}</td>
                <td>
                  {person.role === 'STAFF' && (
                    <button
                      className="link-button small"
                      onClick={() => {
                        if (confirm(`Remove staff access for ${person.name}?`)) {
                          run(() => remove(`/staff/${person.id}`));
                        }
                      }}
                    >
                      Remove access
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={addStaff} className="card card-body stack" style={{ marginTop: 32, maxWidth: 560 }}>
        <h2 style={{ fontSize: '1.15rem' }}>Add a staff member yourself</h2>
        <p className="small muted">Skips the request. Tell them the password so they can sign in.</p>

        <div className="grid grid-2" style={{ gap: 14 }}>
          <div>
            <label className="label" htmlFor="staff-name">Name</label>
            <input id="staff-name" className="input" required value={form.name} onChange={update('name')} />
          </div>
          <div>
            <label className="label" htmlFor="staff-email">Email</label>
            <input id="staff-email" type="email" className="input" required value={form.email} onChange={update('email')} />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="staff-password">Starting password</label>
          <input id="staff-password" type="password" className="input" required minLength={8} value={form.password} onChange={update('password')} />
        </div>

        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">Add staff member</button>
      </form>
    </div>
  );
}
