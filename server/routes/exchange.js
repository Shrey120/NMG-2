import express from 'express';
import { pool } from '../db.js';
import { requireUser, requireStaff, route } from '../auth.js';

export const router = express.Router();

// How the client asked for this to work:
//   Autowerke lists an item it will swap.
//   A signed in customer offers a specific part in return, plus or minus cash.
//   The two sides negotiate in a message thread until staff accept or decline.
//
// Routes with a fixed name are declared before "/:id", otherwise Express
// would read "offers" as an id.

// --- Offers ---------------------------------------------------------------

// Everything the signed in customer has offered, newest first.
router.get(
  '/offers/mine',
  requireUser,
  route(async (req, res) => {
    const [offers] = await pool.query(
      `SELECT o.*, e.title AS exchangeTitle
       FROM exchangeOffers o
       JOIN exchanges e ON e.id = o.exchangeId
       WHERE o.userId = ?
       ORDER BY o.createdAt DESC`,
      [req.user.id]
    );
    res.json(offers);
  })
);

// Every offer, for the staff screen.
router.get(
  '/offers/all',
  requireStaff,
  route(async (req, res) => {
    const [offers] = await pool.query(
      `SELECT o.*, e.title AS exchangeTitle, u.name AS customerName, u.email AS customerEmail
       FROM exchangeOffers o
       JOIN exchanges e ON e.id = o.exchangeId
       JOIN users u ON u.id = o.userId
       ORDER BY o.status = 'pending' DESC, o.createdAt DESC`
    );
    res.json(offers);
  })
);

// Only the customer who made the offer, or a staff member, may read the thread.
async function canSeeOffer(offerId, user) {
  const [[offer]] = await pool.query('SELECT * FROM exchangeOffers WHERE id = ?', [offerId]);
  if (!offer) return null;
  if (user.role === 'CUSTOMER' && offer.userId !== user.id) return null;
  return offer;
}

router.get(
  '/offers/:offerId/messages',
  requireUser,
  route(async (req, res) => {
    const offer = await canSeeOffer(req.params.offerId, req.user);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });

    const [messages] = await pool.query(
      `SELECT m.id, m.body, m.createdAt, u.name AS senderName, u.role AS senderRole
       FROM offerMessages m
       JOIN users u ON u.id = m.userId
       WHERE m.offerId = ?
       ORDER BY m.createdAt`,
      [req.params.offerId]
    );
    res.json({ offer, messages });
  })
);

router.post(
  '/offers/:offerId/messages',
  requireUser,
  route(async (req, res) => {
    const offer = await canSeeOffer(req.params.offerId, req.user);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    if (!req.body.body) return res.status(400).json({ error: 'Write a message first' });

    await pool.query('INSERT INTO offerMessages (offerId, userId, body) VALUES (?, ?, ?)', [
      req.params.offerId,
      req.user.id,
      req.body.body,
    ]);
    res.status(201).json({ ok: true });
  })
);

// Staff accept or decline.
router.patch(
  '/offers/:offerId',
  requireStaff,
  route(async (req, res) => {
    const allowed = ['pending', 'accepted', 'declined'];
    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ error: 'Unknown status' });
    }
    await pool.query('UPDATE exchangeOffers SET status = ? WHERE id = ?', [
      req.body.status,
      req.params.offerId,
    ]);
    res.json({ ok: true });
  })
);

// --- Exchange items -------------------------------------------------------

router.get(
  '/',
  route(async (req, res) => {
    const [items] = await pool.query(
      `SELECT e.*, COUNT(o.id) AS offerCount
       FROM exchanges e
       LEFT JOIN exchangeOffers o ON o.exchangeId = e.id
       GROUP BY e.id
       ORDER BY e.createdAt DESC`
    );
    res.json(items);
  })
);

router.get(
  '/:id',
  route(async (req, res) => {
    const [items] = await pool.query('SELECT * FROM exchanges WHERE id = ?', [req.params.id]);
    if (items.length === 0) return res.status(404).json({ error: 'Exchange item not found' });
    res.json(items[0]);
  })
);

router.post(
  '/:id/offers',
  requireUser,
  route(async (req, res) => {
    const [items] = await pool.query('SELECT * FROM exchanges WHERE id = ?', [req.params.id]);
    if (items.length === 0) return res.status(404).json({ error: 'Exchange item not found' });
    if (!req.body.offering) return res.status(400).json({ error: 'Describe what you are offering' });

    const [result] = await pool.query(
      'INSERT INTO exchangeOffers (exchangeId, userId, offering, cashAdjustment) VALUES (?, ?, ?, ?)',
      [req.params.id, req.user.id, req.body.offering, Number(req.body.cashAdjustment) || 0]
    );

    // The first message starts the negotiation thread.
    if (req.body.message) {
      await pool.query('INSERT INTO offerMessages (offerId, userId, body) VALUES (?, ?, ?)', [
        result.insertId,
        req.user.id,
        req.body.message,
      ]);
    }

    res.status(201).json({ id: result.insertId });
  })
);

router.post(
  '/',
  requireStaff,
  route(async (req, res) => {
    const e = req.body;
    const [result] = await pool.query(
      `INSERT INTO exchanges (title, make, offering, wanting, description, createdAt)
       VALUES (?, ?, ?, ?, ?, CURDATE())`,
      [e.title, e.make || '', e.offering, e.wanting, e.description || '']
    );
    res.status(201).json({ id: result.insertId });
  })
);

router.put(
  '/:id',
  requireStaff,
  route(async (req, res) => {
    const e = req.body;
    await pool.query(
      'UPDATE exchanges SET title = ?, make = ?, offering = ?, wanting = ?, description = ?, status = ? WHERE id = ?',
      [e.title, e.make || '', e.offering, e.wanting, e.description || '', e.status || 'open', req.params.id]
    );
    res.json({ ok: true });
  })
);

router.delete(
  '/:id',
  requireStaff,
  route(async (req, res) => {
    await pool.query('DELETE FROM exchanges WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  })
);
