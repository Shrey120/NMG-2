import express from 'express';
import crypto from 'node:crypto';
import { pool } from '../db.js';
import { readUser, requireStaff, route } from '../auth.js';
import { isSlotBookable } from '../slots.js';
import {
  emailOwnerNewBooking,
  emailCustomerPending,
  emailCustomerAccepted,
  emailCustomerDeclined,
} from '../mail.js';

export const router = express.Router();

const baseUrl = (req) => process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;

async function loadBooking(id) {
  const [[booking]] = await pool.query(
    `SELECT b.*, s.title AS serviceTitle
     FROM bookings b JOIN services s ON s.id = b.serviceId
     WHERE b.id = ?`,
    [id]
  );
  return booking;
}

// Accepting or declining is the same shape of work whether it came from the
// admin panel or from a link in an email, so both go through here.
async function decide(booking, decision) {
  if (booking.status !== 'Pending') {
    return { ok: false, message: `This booking has already been ${booking.status.toLowerCase()}.` };
  }

  if (decision === 'accept') {
    // Someone else may have been accepted into this slot in the meantime.
    const free = await isSlotBookable(booking.bookingDate, booking.slotTime);
    if (!free) {
      return { ok: false, message: 'That slot is no longer free. Another booking has taken it.' };
    }

    await pool.query(
      "UPDATE bookings SET status = 'Accepted', decidedAt = NOW(), actionToken = NULL WHERE id = ?",
      [booking.id]
    );
    await emailCustomerAccepted(booking, booking.serviceTitle);
    return { ok: true, message: 'Booking accepted. The customer has been emailed and the slot is now reserved.' };
  }

  await pool.query(
    "UPDATE bookings SET status = 'Declined', decidedAt = NOW(), actionToken = NULL WHERE id = ?",
    [booking.id]
  );
  await emailCustomerDeclined(booking, booking.serviceTitle);
  return { ok: true, message: 'Booking declined. The customer has been emailed and the slot stays open.' };
}

// ---------------------------------------------------------------------------
// Accept or decline straight from the email.
//
// This is opened from a mail app, so it answers with a small web page rather
// than JSON, and it cannot expect the person to be signed in. The random
// token in the link is the proof, and it only works once.
// ---------------------------------------------------------------------------

const page = (heading, message) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${heading}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
         background: #fff; color: #000; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 24px; }
  .box { max-width: 460px; border: 1px solid #e4e4e4; border-radius: 4px; padding: 32px; }
  h1 { font-size: 1.4rem; margin: 0 0 12px; letter-spacing: -0.02em; }
  p { color: #5c5c5c; line-height: 1.6; margin: 0; }
  a { display: inline-block; margin-top: 24px; background: #000; color: #fff; text-decoration: none;
      padding: 12px 22px; border-radius: 4px; font-weight: 600; font-size: 0.9rem; }
</style></head>
<body><div class="box"><h1>${heading}</h1><p>${message}</p>
<a href="/admin/bookings">Open the admin panel</a></div></body></html>`;

router.get(
  '/action',
  route(async (req, res) => {
    const { token, do: decision } = req.query;
    res.type('html');

    if (!['accept', 'decline'].includes(decision)) {
      return res.status(400).send(page('Unknown action', 'That link is not one we recognise.'));
    }

    const [[found]] = await pool.query('SELECT id FROM bookings WHERE actionToken = ?', [token || '']);
    if (!found) {
      return res
        .status(404)
        .send(page('Link already used', 'This booking has already been decided, or the link has expired. Open the admin panel to see where it stands.'));
    }

    const booking = await loadBooking(found.id);
    const result = await decide(booking, decision);
    res.send(page(result.ok ? 'Done' : 'Nothing changed', result.message));
  })
);

// ---------------------------------------------------------------------------
// Making a booking
// ---------------------------------------------------------------------------

router.post(
  '/',
  readUser,
  route(async (req, res) => {
    const b = req.body;
    if (!b.consent) return res.status(400).json({ error: 'Please accept the privacy policy' });

    const [[service]] = await pool.query('SELECT id, bookable FROM services WHERE id = ?', [b.serviceId]);
    if (!service) return res.status(400).json({ error: 'Choose a service' });
    if (service.bookable === 0) return res.status(400).json({ error: 'That service cannot be booked online' });

    // Checked again here, not just in the browser, so the slot cannot be
    // taken by editing the request.
    if (!(await isSlotBookable(b.bookingDate, b.slotTime))) {
      return res.status(400).json({ error: 'That slot is no longer available. Please pick another.' });
    }

    const actionToken = crypto.randomBytes(24).toString('hex');

    const [result] = await pool.query(
      `INSERT INTO bookings
       (serviceId, userId, name, email, phone, vehicle, bookingDate, slotTime, notes, status, actionToken, consentAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, NOW())`,
      [
        b.serviceId, req.user?.id || null, b.name, b.email, b.phone || '',
        b.vehicle, b.bookingDate, b.slotTime, b.notes || '', actionToken,
      ]
    );

    const booking = await loadBooking(result.insertId);

    // The owner gets the request with accept and decline links; the customer
    // gets an acknowledgement making clear nothing is confirmed yet.
    await emailOwnerNewBooking(booking, booking.serviceTitle, baseUrl(req));
    await emailCustomerPending(booking, booking.serviceTitle);

    res.status(201).json({ ok: true, status: 'Pending' });
  })
);

// ---------------------------------------------------------------------------
// Admin panel
// ---------------------------------------------------------------------------

router.get(
  '/',
  requireStaff,
  route(async (req, res) => {
    const [bookings] = await pool.query(
      `SELECT b.*, s.title AS serviceTitle
       FROM bookings b JOIN services s ON s.id = b.serviceId
       ORDER BY b.status = 'Pending' DESC, b.bookingDate, b.slotTime`
    );
    res.json(bookings);
  })
);

router.patch(
  '/:id',
  requireStaff,
  route(async (req, res) => {
    const booking = await loadBooking(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const { status } = req.body;

    if (status === 'Accepted' || status === 'Declined') {
      const result = await decide(booking, status === 'Accepted' ? 'accept' : 'decline');
      if (!result.ok) return res.status(400).json({ error: result.message });
      return res.json({ ok: true, message: result.message });
    }

    if (status === 'Cancelled') {
      await pool.query("UPDATE bookings SET status = 'Cancelled' WHERE id = ?", [req.params.id]);
      return res.json({ ok: true, message: 'Booking cancelled. The slot is free again.' });
    }

    res.status(400).json({ error: 'Unknown status' });
  })
);
