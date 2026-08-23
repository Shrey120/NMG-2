import express from 'express';
import { pool } from '../db.js';
import { requireStaff, route } from '../auth.js';

export const router = express.Router();

router.get(
  '/',
  route(async (req, res) => {
    // The admin panel asks for every review; the public site only gets the
    // approved ones.
    const showAll = req.query.all === 'true';
    const [testimonials] = await pool.query(
      showAll
        ? 'SELECT * FROM testimonials ORDER BY createdAt DESC'
        : 'SELECT * FROM testimonials WHERE approved = 1 ORDER BY createdAt DESC'
    );
    res.json(testimonials);
  })
);

router.patch(
  '/:id',
  requireStaff,
  route(async (req, res) => {
    await pool.query('UPDATE testimonials SET approved = ? WHERE id = ?', [
      req.body.approved ? 1 : 0,
      req.params.id,
    ]);
    res.json({ ok: true });
  })
);
