import express from 'express';
import { pool } from '../db.js';
import { requireAdmin, route } from '../auth.js';

export const router = express.Router();

// The footer and contact page read this, so it is public.
router.get(
  '/',
  route(async (req, res) => {
    const [[details]] = await pool.query('SELECT * FROM businessDetails WHERE id = 1');
    const [hours] = await pool.query('SELECT * FROM openingHours ORDER BY sortOrder, id');
    res.json({ ...details, hours });
  })
);

// Only an administrator can change what the website says about the business.
router.put(
  '/',
  requireAdmin,
  route(async (req, res) => {
    const b = req.body;

    await pool.query(
      'UPDATE businessDetails SET name = ?, abn = ?, suburb = ?, email = ?, blurb = ? WHERE id = 1',
      [b.name, b.abn, b.suburb, b.email, b.blurb]
    );

    // The hours are a short list, so the simplest correct approach is to
    // clear them and write back what was submitted.
    await pool.query('DELETE FROM openingHours');

    const lines = (b.hours || []).filter((line) => line.label && line.hours);
    for (const [index, line] of lines.entries()) {
      await pool.query('INSERT INTO openingHours (label, hours, sortOrder) VALUES (?, ?, ?)', [
        line.label,
        line.hours,
        index + 1,
      ]);
    }

    res.json({ ok: true });
  })
);
