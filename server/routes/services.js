import express from 'express';
import { pool } from '../db.js';
import { requireAdmin, route } from '../auth.js';

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
