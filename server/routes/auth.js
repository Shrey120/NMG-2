import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { makeToken, requireUser, route } from '../auth.js';
import { emailOwnerNewStaff } from '../mail.js';

export const router = express.Router();

// Sign-up asks whether you are a customer or a member of staff, and either
// account works straight away - no approval step.
//
//   customer -> signed in, taken to their account page
//   staff    -> signed in, taken to the admin panel
//
// Administrator accounts can never be created from this form. Anything other
// than "staff" is treated as a customer, so editing the request cannot
// produce an administrator.
router.post(
  '/register',
  route(async (req, res) => {
    const { name, email, password, phone, suburb, consent, accountType } = req.body;

    if (!consent) return res.status(400).json({ error: 'Please accept the privacy policy' });
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'That email is already registered' });
    }

    const role = accountType === 'staff' ? 'STAFF' : 'CUSTOMER';

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (name, email, passwordHash, phone, suburb, role, consentAt)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [name, email, passwordHash, phone || '', suburb || '', role]
    );

    // Not an approval - just lets the owner know a new staff account exists,
    // so they can remove it from Staff accounts if they do not recognise it.
    if (role === 'STAFF') await emailOwnerNewStaff({ name, email });

    const user = { id: result.insertId, name, role };
    res.status(201).json({ token: makeToken(user), name, role });
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
