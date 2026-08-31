import express from 'express';
import { pool } from '../db.js';
import { requireAdmin, route } from '../auth.js';
import { uploadImage } from '../upload.js';

export const router = express.Router();

router.get(
  '/',
  route(async (req, res) => {
    const [services] = await pool.query('SELECT * FROM services ORDER BY sortOrder, id');
    res.json(services);
  })
);

// The client asked to be able to manage the service list themselves.
router.post(
  '/',
  requireAdmin,
  route(async (req, res) => {
    const s = req.body;
    const [result] = await pool.query(
      'INSERT INTO services (title, summary, detail, price, bookable, sortOrder) VALUES (?, ?, ?, ?, ?, ?)',
      [s.title, s.summary, s.detail, s.price, s.bookable ? 1 : 0, s.sortOrder || 0]
    );
    res.status(201).json({ id: result.insertId });
  })
);

router.put(
  '/:id',
  requireAdmin,
  route(async (req, res) => {
    const s = req.body;
    await pool.query(
      'UPDATE services SET title = ?, summary = ?, detail = ?, price = ?, bookable = ?, sortOrder = ? WHERE id = ?',
      [s.title, s.summary, s.detail, s.price, s.bookable ? 1 : 0, s.sortOrder || 0, req.params.id]
    );
    res.json({ ok: true });
  })
);

router.delete(
  '/:id',
  requireAdmin,
  route(async (req, res) => {
    await pool.query('DELETE FROM services WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  })
);

// Picture for one service. The client will supply real photographs later,
// so this is how they get in without a developer.
router.post(
  '/:id/image',
  requireAdmin,
  uploadImage,
  route(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Choose a JPEG, PNG or WebP image' });
    await pool.query('UPDATE services SET image = ? WHERE id = ?', [req.file.filename, req.params.id]);
    res.json({ image: req.file.filename });
  })
);

router.delete(
  '/:id/image',
  requireAdmin,
  route(async (req, res) => {
    await pool.query('UPDATE services SET image = NULL WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  })
);
