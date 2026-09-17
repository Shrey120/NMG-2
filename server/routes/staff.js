import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { requireAdmin, route } from '../auth.js';

export const router = express.Router();

// Seeing and managing who has staff access. Administrator only.

router.get(
  '/',
  requireAdmin,
  route(async (req, res) => {
    const [people] = await pool.query(
      `SELECT id, name, email, phone, role, createdAt
       FROM users
       WHERE role IN ('STAFF', 'ADMIN')
       ORDER BY role, name`
    );
    res.json(people);
  })
);

// An administrator can add a staff member for someone, as well as people
// signing up as staff themselves.
router.post(
  '/',
  requireAdmin,
  route(async (req, res) => {
    const { name, email, password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'That email is already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (name, email, passwordHash, role, consentAt) VALUES (?, ?, ?, 'STAFF', NOW())`,
      [name, email, passwordHash]
    );
    res.status(201).json({ ok: true });
  })
);

// Removing access turns the person into an ordinary customer rather than
// deleting them, so anything they posted keeps an owner.
router.delete(
  '/:id',
  requireAdmin,
  route(async (req, res) => {
    const [[user]] = await pool.query("SELECT id, name FROM users WHERE id = ? AND role = 'STAFF'", [req.params.id]);
    if (!user) return res.status(404).json({ error: 'Staff account not found' });

    await pool.query("UPDATE users SET role = 'CUSTOMER' WHERE id = ?", [user.id]);
    res.json({ ok: true, message: `${user.name} no longer has staff access.` });
  })
);
