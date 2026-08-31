import { useState, useEffect } from 'react';
import { useLoad } from '../../useLoad.js';
import { put, post, remove } from '../../api.js';
import { isAdmin } from '../../auth.js';
import Loading from '../../components/Loading.jsx';

const SLOT_LENGTHS = [30, 45, 60, 90, 120];

export default function AdminAvailability() {
  const week = useLoad('/availability');
  const blocks = useLoad('/availability/blocks');

  const [days, setDays] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [block, setBlock] = useState({ blockDate: '', slotTime: '', reason: '' });

  useEffect(() => {
    if (week.data) setDays(week.data.map((day) => ({ ...day })));
  }, [week.data]);

  if (week.loading || !days) return <Loading />;

  function updateDay(weekday, field, value) {
    setDays(days.map((day) => (day.weekday === weekday ? { ...day, [field]: value } : day)));
    setSaved(false);
  }

  async function saveWeek(event) {
    event.preventDefault();
    setSaving(true);
    await put('/availability', { days });
    setSaving(false);
    setSaved(true);
    week.reload();
  }

  async function addBlock(event) {
    event.preventDefault();
    await post('/availability/blocks', {
      ...block,
      slotTime: block.slotTime ? `${block.slotTime}:00` : null,
    });
    setBlock({ blockDate: '', slotTime: '', reason: '' });
    blocks.reload();
  }

  async function removeBlock(id) {
    await remove(`/availability/blocks/${id}`);
    blocks.reload();
  }

  return (
    <div>
      <h1>Availability</h1>
      <p className="muted" style={{ marginTop: 6 }}>
        The opening hours below decide two things at once: what the website shows
        as your opening hours, and which slots customers can book.
      </p>

      {/* --- Weekly hours --- */}
      <form onSubmit={saveWeek} className="card card-body" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: '1.15rem' }}>Weekly opening hours</h2>

        <div className="table-wrap" style={{ marginTop: 16, border: 0 }}>
          <table>
            <thead>
              <tr><th>Day</th><th>Open</th><th>From</th><th>To</th><th>Slot length</th></tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day.weekday}>
                  <td><strong>{day.dayName}</strong></td>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Open on ${day.dayName}`}
                      checked={day.isOpen === 1}
                      onChange={(event) => updateDay(day.weekday, 'isOpen', event.target.checked ? 1 : 0)}
                      disabled={!isAdmin()}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      className="input"
                      aria-label={`${day.dayName} opens`}
                      value={String(day.openTime).slice(0, 5)}
                      onChange={(event) => updateDay(day.weekday, 'openTime', `${event.target.value}:00`)}
                      disabled={day.isOpen === 0 || !isAdmin()}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      className="input"
                      aria-label={`${day.dayName} closes`}
                      value={String(day.closeTime).slice(0, 5)}
                      onChange={(event) => updateDay(day.weekday, 'closeTime', `${event.target.value}:00`)}
                      disabled={day.isOpen === 0 || !isAdmin()}
                    />
                  </td>
                  <td>
                    <select
                      className="input"
                      aria-label={`${day.dayName} slot length`}
                      value={day.slotMinutes}
                      onChange={(event) => updateDay(day.weekday, 'slotMinutes', Number(event.target.value))}
                      disabled={day.isOpen === 0 || !isAdmin()}
                    >
                      {SLOT_LENGTHS.map((minutes) => (
                        <option key={minutes} value={minutes}>{minutes} min</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isAdmin() ? (
          <div className="row" style={{ marginTop: 16 }}>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save opening hours'}
            </button>
            {saved && !saving && <span className="small muted">Saved.</span>}
          </div>
        ) : (
          <p className="form-note" style={{ marginTop: 16 }}>
            Only an administrator can change the weekly hours. You can still block
            individual dates below.
          </p>
        )}
      </form>

      {/* --- Blocking --- */}
      <div className="card card-body" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: '1.15rem' }}>Blocked dates and slots</h2>
        <p className="small muted" style={{ marginTop: 6 }}>
          Take a whole day out for a public holiday, or a single slot for
          something like machine maintenance. Blocked times cannot be booked.
        </p>

        <form onSubmit={addBlock} className="row" style={{ marginTop: 16, alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 160px' }}>
            <label className="label" htmlFor="blockDate">Date</label>
            <input
              id="blockDate"
              type="date"
              className="input"
              required
              value={block.blockDate}
              onChange={(event) => setBlock({ ...block, blockDate: event.target.value })}
            />
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label className="label" htmlFor="blockTime">Time (optional)</label>
            <input
              id="blockTime"
              type="time"
              className="input"
              value={block.slotTime}
              onChange={(event) => setBlock({ ...block, slotTime: event.target.value })}
            />
          </div>
          <div style={{ flex: '2 1 200px' }}>
            <label className="label" htmlFor="blockReason">Reason</label>
            <input
              id="blockReason"
              className="input"
              placeholder="Public holiday"
              value={block.reason}
              onChange={(event) => setBlock({ ...block, reason: event.target.value })}
            />
          </div>
          <button type="submit" className="btn">Block</button>
        </form>

        <p className="form-note" style={{ marginTop: 8 }}>
          Leave the time empty to block the whole day.
        </p>

        {blocks.loading ? (
          <Loading />
        ) : (blocks.data || []).length === 0 ? (
          <p className="small muted" style={{ marginTop: 20 }}>Nothing is blocked at the moment.</p>
        ) : (
          <div className="table-wrap" style={{ marginTop: 20 }}>
            <table>
              <thead>
                <tr><th>Date</th><th>Time</th><th>Reason</th><th></th></tr>
              </thead>
              <tbody>
                {blocks.data.map((entry) => (
                  <tr key={entry.id}>
                    <td className="mono">{entry.blockDate}</td>
                    <td>{entry.slotTime ? String(entry.slotTime).slice(0, 5) : 'Whole day'}</td>
                    <td className="muted">{entry.reason || '-'}</td>
                    <td>
                      <button className="link-button small" onClick={() => removeBlock(entry.id)}>
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
