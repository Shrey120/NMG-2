import jwt from 'jsonwebtoken';
import './env.js';

const SECRET = process.env.JWT_SECRET || 'change-this-to-a-long-random-string';

// Three roles, in order of how much they can do.
export const CUSTOMER = 'CUSTOMER';
export const STAFF = 'STAFF';
export const ADMIN = 'ADMIN';

export function makeToken(user) {
  return jwt.sign({ id: user.id, name: user.name, role: user.role }, SECRET, { expiresIn: '8h' });
}

// Reads the token if one was sent, but does not insist on it. Used on routes
// that work for both guests and signed in people.
export function readUser(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, SECRET);
  } catch {
    req.user = null;
  }
  next();
}

// Builds a middleware that only lets the listed roles through.
function allow(...roles) {
  return (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    try {
      req.user = jwt.verify(token, SECRET);
    } catch {
      return res.status(401).json({ error: 'Please sign in' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have access to that' });
    }
    next();
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
