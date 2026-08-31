import express from 'express';
import { pool } from '../db.js';
import { readUser, requireStaff, route } from '../auth.js';
import { uploadPhoto } from '../upload.js';
import { emailOwnerEnquiry, emailCustomerEnquiryAck } from '../mail.js';

export const router = express.Router();

// Guests may send an enquiry. If they happen to be signed in we record who it
// was, which is what lets the website offer to fill the form in for them.
//
// uploadPhoto runs first because the optional photo arrives as form data
// rather than JSON. It puts the text fields on req.body and the file, if any,
// on req.file.
router.post(
  '/',
  readUser,
  uploadPhoto,
  route(async (req, res) => {
    const e = req.body;
    if (e.consent !== 'true' && e.consent !== true) {
      return res.status(400).json({ error: 'Please accept the privacy policy' });
    }

    await pool.query(
      `INSERT INTO enquiries (type, name, email, phone, vehicle, subject, message, photo, listingId, userId, consentAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        e.type || 'General',
        e.name,
        e.email,
        e.phone || '',
        e.vehicle || '',
        e.subject,
        e.message,
        req.file ? req.file.filename : null,
        e.listingId || null,
        req.user?.id || null,
      ]
    );

    // The owner is notified, and the sender gets an acknowledgement.
    await emailOwnerEnquiry(e);
    await emailCustomerEnquiryAck(e);

    res.status(201).json({ ok: true });
  })
);

router.get(
  '/',
  requireStaff,
  route(async (req, res) => {
    const [enquiries] = await pool.query('SELECT * FROM enquiries ORDER BY createdAt DESC');
    res.json(enquiries);
  })
);

router.patch(
  '/:id',
  requireStaff,
  route(async (req, res) => {
    const allowed = ['new', 'read', 'replied'];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Unknown status' });

    await pool.query('UPDATE enquiries SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ ok: true });
  })
);
