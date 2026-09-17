import jwt from 'jsonwebtoken';
import './env.js';
import { pool } from './db.js';

const SECRET = process.env.JWT_SECRET || 'change-this-to-a-long-random-string';

// Three roles, in order of how much they can do.
export const CUSTOMER = 'CUSTOMER';
export const STAFF = 'STAFF';
export const ADMIN = 'ADMIN';

export function makeToken(user) {
  return jwt.sign({ id: user.id, name: user.name, role: user.role }, SECRET, { expiresIn: '8h' });
}

const tokenFrom = (req) => (req.headers.authorization || '').replace('Bearer ', '');

// Reads the token if one was sent, but does not insist on it. Used on routes
// that work for both guests and signed in people.
export function readUser(req, res, next) {
  try {
    req.user = jwt.verify(tokenFrom(req), SECRET);
  } catch {
    req.user = null;
  }
  next();
}

// Builds a middleware that only lets the listed roles through.
//
// The role is read fresh from the database rather than trusted from the
// token. That way when an administrator removes someone's staff access it
// takes effect on their very next click, instead of lasting until their
// 8 hour token runs out.
function allow(...roles) {
  return async (req, res, next) => {
    let fromToken;
    try {
      fromToken = jwt.verify(tokenFrom(req), SECRET);
    } catch {
      return res.status(401).json({ error: 'Please sign in' });
    }

    try {
      const [[user]] = await pool.query('SELECT id, name, role FROM users WHERE id = ?', [fromToken.id]);

      if (!user) return res.status(401).json({ error: 'Please sign in' });
      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: 'You do not have access to that' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
}

export const requireUser = allow(CUSTOMER, STAFF, ADMIN);
export const requireStaff = allow(STAFF, ADMIN);
export const requireAdmin = allow(ADMIN);

// Wraps an async route so we do not need a try/catch in every one.
export const route = (handler) => (req, res) =>
  handler(req, res).catch((error) => {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  });
