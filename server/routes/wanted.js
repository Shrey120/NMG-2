import express from 'express';
import { pool } from '../db.js';
import { requireUser, requireStaff, route } from '../auth.js';

export const router = express.Router();

// The public sees approved posts only. Staff pass ?pending=true to see the
// queue of posts waiting to be checked.
router.get(
  '/',
  route(async (req, res) => {
    const [posts] = await pool.query(
      req.query.pending === 'true'
        ? 'SELECT * FROM wanted ORDER BY approved, createdAt DESC'
        : 'SELECT * FROM wanted WHERE approved = 1 ORDER BY createdAt DESC'
    );
    res.json(posts);
  })
);

// Posting requires an account, because staff need a way to reply.
router.post(
  '/',
  requireUser,
  route(async (req, res) => {
    const p = req.body;
    const isStaff = req.user.role !== 'CUSTOMER';

    const [[user]] = await pool.query('SELECT email FROM users WHERE id = ?', [req.user.id]);

    await pool.query(
      `INSERT INTO wanted (title, make, postedBy, userId, isStaff, contact, budget, description, approved, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [
        p.title,
        p.make || '',
        req.user.name,
        req.user.id,
        isStaff ? 1 : 0,
        user.email,
        p.budget || '',
        p.description,
        // Staff posts go straight up. Customer posts wait for approval.
        isStaff ? 1 : 0,
      ]
    );

    res.status(201).json({ ok: true, needsApproval: !isStaff });
  })
);

router.patch(
  '/:id',
  requireStaff,
  route(async (req, res) => {
    await pool.query('UPDATE wanted SET approved = ? WHERE id = ?', [
      req.body.approved ? 1 : 0,
      req.params.id,
    ]);
    res.json({ ok: true });
  })
);

router.delete(
  '/:id',
  requireStaff,
  route(async (req, res) => {
    await pool.query('DELETE FROM wanted WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  })
);
