import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { makeToken, requireUser, route } from '../auth.js';

export const router = express.Router();

// Anyone signing up through the website is a customer. Staff and admin
// accounts are created by an administrator, never by this route.
router.post(
  '/register',
  route(async (req, res) => {
    const { name, email, password, phone, suburb, consent } = req.body;

    if (!consent) return res.status(400).json({ error: 'Please accept the privacy policy' });
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'That email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (name, email, passwordHash, phone, suburb, role, consentAt)
       VALUES (?, ?, ?, ?, ?, 'CUSTOMER', NOW())`,
      [name, email, passwordHash, phone || '', suburb || '']
    );

    const user = { id: result.insertId, name, role: 'CUSTOMER' };
    res.status(201).json({ token: makeToken(user), name, role: 'CUSTOMER' });
  })
);

router.post(
  '/login',
  route(async (req, res) => {
    const { email, password } = req.body;

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    // Compare the typed password against the stored hash.
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    res.json({ token: makeToken(user), name: user.name, role: user.role });
  })
);

router.get(
  '/me',
  requireUser,
  route(async (req, res) => {
    const [users] = await pool.query(
      'SELECT id, name, email, phone, suburb, role FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(users[0] || null);
  })
);
