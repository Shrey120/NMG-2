import express from 'express';
import { pool } from '../db.js';
import { requireAdmin, route } from '../auth.js';

export const router = express.Router();

const DAY_NAMES = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// "08:00:00" -> "8:00am"
function pretty(time) {
  const [hour, minute] = String(time).split(':').map(Number);
  const suffix = hour < 12 ? 'am' : 'pm';
  const shown = hour % 12 === 0 ? 12 : hour % 12;
  return `${shown}:${String(minute).padStart(2, '0')}${suffix}`;
}

// The opening hours shown on the website are built from the same rows that
// decide which slots can be booked, so the two can never disagree.
// Days running together with the same hours are joined into one line, which
// turns five identical rows into "Monday to Friday".
function describeHours(days) {
  const inOrder = [2, 3, 4, 5, 6, 7, 1].map((weekday) => days.find((day) => day.weekday === weekday));
  const lines = [];

  for (const day of inOrder) {
    if (!day) continue;

    const hours = day.isOpen === 0 ? 'Closed' : `${pretty(day.openTime)} - ${pretty(day.closeTime)}`;
    const last = lines[lines.length - 1];

    if (last && last.hours === hours) {
      last.endDay = DAY_NAMES[day.weekday];
    } else {
      lines.push({ startDay: DAY_NAMES[day.weekday], endDay: null, hours });
    }
  }

  return lines.map((line, index) => ({
    id: index,
    label: line.endDay ? `${line.startDay} to ${line.endDay}` : line.startDay,
    hours: line.hours,
  }));
}

router.get(
  '/',
  route(async (req, res) => {
    const [[details]] = await pool.query('SELECT * FROM businessDetails WHERE id = 1');
    const [days] = await pool.query('SELECT * FROM availability ORDER BY weekday');
    res.json({ ...details, hours: describeHours(days) });
  })
);

// The hours are not edited here. They are part of availability, because they
// also decide what customers can book.
router.put(
  '/',
  requireAdmin,
  route(async (req, res) => {
    const b = req.body;
    await pool.query(
      'UPDATE businessDetails SET name = ?, abn = ?, suburb = ?, email = ?, blurb = ? WHERE id = 1',
      [b.name, b.abn, b.suburb, b.email, b.blurb]
    );
    res.json({ ok: true });
  })
);
