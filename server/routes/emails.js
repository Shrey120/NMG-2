import express from 'express';
import { pool } from '../db.js';
import { requireStaff, route } from '../auth.js';

export const router = express.Router();

// Every email the site has produced, newest first. When no mail account is
// set up nothing is actually sent, so this is where you read them - and the
// Accept and Decline links inside work from here too. Works the same on
// Windows, Mac and Linux with nothing extra installed.
router.get(
  '/',
  requireStaff,
  route(async (req, res) => {
    const [emails] = await pool.query('SELECT * FROM emailLog ORDER BY id DESC LIMIT 100');
    res.json(emails);
  })
);
