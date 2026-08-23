import express from 'express';
import { pool } from '../db.js';
import { readUser, requireStaff, route } from '../auth.js';

export const router = express.Router();

// The client confirmed that anyone can book a service, signed in or not.
// readUser attaches the account if there is one, without insisting on it.
router.post(
  '/',
  readUser,
  route(async (req, res) => {
    const b = req.body;
    if (!b.consent) return res.status(400).json({ error: 'Please accept the privacy policy' });

    const [[service]] = await pool.query('SELECT id, bookable FROM services WHERE id = ?', [b.serviceId]);
    if (!service) return res.status(400).json({ error: 'Choose a service' });
    if (service.bookable === 0) return res.status(400).json({ error: 'That service cannot be booked online' });

    await pool.query(
      `INSERT INTO bookings (serviceId, userId, name, email, phone, vehicle, preferredDate, notes, consentAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [b.serviceId, req.user?.id || null, b.name, b.email, b.phone || '', b.vehicle, b.preferredDate, b.notes || '']
    );

    res.status(201).json({ ok: true });
  })
);

router.get(
  '/',
  requireStaff,
  route(async (req, res) => {
    const [bookings] = await pool.query(
      `SELECT b.*, s.title AS serviceTitle
       FROM bookings b
       JOIN services s ON s.id = b.serviceId
       ORDER BY b.status = 'requested' DESC, b.preferredDate`
    );
    res.json(bookings);
  })
);

router.patch(
  '/:id',
  requireStaff,
  route(async (req, res) => {
    const allowed = ['requested', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Unknown status' });

    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ ok: true });
  })
);
