import express from 'express';
import { pool } from '../db.js';
import { requireStaff, route } from '../auth.js';

export const router = express.Router();

// Only these three sort options are allowed. The value from the browser is
// never put into the SQL directly, which stops anyone injecting their own.
const SORT_OPTIONS = {
  newest: 'createdAt DESC',
  cheapest: 'price ASC',
  dearest: 'price DESC',
};

const PER_PAGE = 12;

router.get(
  '/',
  route(async (req, res) => {
    const { search, category, make, sort } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);

    // Build the WHERE clause one condition at a time. Every value goes into
    // the "values" array and is sent separately as a ? placeholder, so a
    // search for "'; DROP TABLE" is treated as text, not as SQL.
    const conditions = [];
    const values = [];

    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ? OR partNumber LIKE ? OR fitment LIKE ?)');
      const like = `%${search}%`;
      values.push(like, like, like, like);
    }
    if (category) {
      conditions.push('category = ?');
      values.push(category);
    }
    if (make) {
      conditions.push('make = ?');
      values.push(make);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

    // The client expects a few hundred listings, so pages of 12 are fetched
    // rather than the whole table.
    const [[counted]] = await pool.query(`SELECT COUNT(*) AS total FROM listings ${where}`, values);
    const [listings] = await pool.query(
      `SELECT * FROM listings ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...values, PER_PAGE, (page - 1) * PER_PAGE]
    );

    // The dropdown options on the filter sidebar.
    const [categories] = await pool.query('SELECT DISTINCT category FROM listings ORDER BY category');
    const [makes] = await pool.query('SELECT DISTINCT make FROM listings ORDER BY make');

    res.json({
      listings,
      total: counted.total,
      page,
      pageCount: Math.max(1, Math.ceil(counted.total / PER_PAGE)),
      categories: categories.map((row) => row.category),
      makes: makes.map((row) => row.make),
    });
  })
);

router.get(
  '/:id',
  route(async (req, res) => {
    const [listings] = await pool.query('SELECT * FROM listings WHERE id = ?', [req.params.id]);
    if (listings.length === 0) return res.status(404).json({ error: 'Listing not found' });
    res.json(listings[0]);
  })
);

router.post(
  '/',
  requireStaff,
  route(async (req, res) => {
    const l = req.body;
    const [result] = await pool.query(
      `INSERT INTO listings
       (title, category, make, fitment, partNumber, itemCondition, price, quantity, status, description, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [l.title, l.category, l.make, l.fitment, l.partNumber, l.itemCondition, l.price, l.quantity, l.status, l.description]
    );
    res.status(201).json({ id: result.insertId });
  })
);

router.put(
  '/:id',
  requireStaff,
  route(async (req, res) => {
    const l = req.body;
    await pool.query(
      `UPDATE listings SET title = ?, category = ?, make = ?, fitment = ?, partNumber = ?,
       itemCondition = ?, price = ?, quantity = ?, status = ?, description = ? WHERE id = ?`,
      [l.title, l.category, l.make, l.fitment, l.partNumber, l.itemCondition, l.price, l.quantity, l.status, l.description, req.params.id]
    );
    res.json({ ok: true });
  })
);

router.delete(
  '/:id',
  requireStaff,
  route(async (req, res) => {
    await pool.query('DELETE FROM listings WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  })
);
