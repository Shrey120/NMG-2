import express from 'express';
import { pool } from '../db.js';
import { requireStaff, requireAdmin, route } from '../auth.js';
import { slotsForDate, localDateText } from '../slots.js';

export const router = express.Router();

const DAY_NAMES = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// The weekly opening hours. Public, because the website shows them.
router.get(
  '/',
  route(async (req, res) => {
    const [days] = await pool.query('SELECT * FROM availability ORDER BY weekday');
    res.json(days.map((day) => ({ ...day, dayName: DAY_NAMES[day.weekday] })));
  })
);

// Free slots on one date, for the booking form.
router.get(
  '/slots',
  route(async (req, res) => {
    if (!req.query.date) return res.status(400).json({ error: 'Choose a date first' });
    res.json(await slotsForDate(req.query.date));
  })
);

// Which of the next few weeks have anything free, so the form can grey out
// days the workshop is closed before the customer clicks them.
router.get(
  '/calendar',
  route(async (req, res) => {
    const days = Math.min(Number(req.query.days) || 28, 60);
    const start = new Date();
    const out = [];

    for (let offset = 0; offset < days; offset += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + offset);
      const text = localDateText(date);

      const { open, reason, slots } = await slotsForDate(text);
      out.push({
        date: text,
        open,
        reason,
        freeCount: slots.filter((slot) => slot.available).length,
      });
    }

    res.json(out);
  })
);

// Only an administrator changes the weekly hours, because they are also what
// the public pages display.
router.put(
  '/',
  requireAdmin,
  route(async (req, res) => {
    for (const day of req.body.days || []) {
      await pool.query(
        'UPDATE availability SET isOpen = ?, openTime = ?, closeTime = ?, slotMinutes = ? WHERE weekday = ?',
        [day.isOpen ? 1 : 0, day.openTime, day.closeTime, Number(day.slotMinutes) || 60, day.weekday]
      );
    }
    res.json({ ok: true });
  })
);

// --- Blocking ---------------------------------------------------------------
// Staff can take a date or a single slot out of circulation.

router.get(
  '/blocks',
  requireStaff,
  route(async (req, res) => {
    const [blocks] = await pool.query(
      'SELECT * FROM blockedSlots WHERE blockDate >= CURDATE() ORDER BY blockDate, slotTime'
    );
    res.json(blocks);
  })
);

router.post(
  '/blocks',
  requireStaff,
  route(async (req, res) => {
    const { blockDate, slotTime, reason } = req.body;
    if (!blockDate) return res.status(400).json({ error: 'Choose a date to block' });

    await pool.query('INSERT INTO blockedSlots (blockDate, slotTime, reason) VALUES (?, ?, ?)', [
      blockDate,
      slotTime || null, // no time means the whole day
      reason || '',
    ]);
    res.status(201).json({ ok: true });
  })
);

router.delete(
  '/blocks/:id',
  requireStaff,
  route(async (req, res) => {
    await pool.query('DELETE FROM blockedSlots WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  })
);
