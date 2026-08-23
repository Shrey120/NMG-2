import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import './env.js';
import { pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 4100;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-to-a-long-random-string';

app.use(cors());
app.use(express.json());

// Every route below is an async function. This wrapper catches any error
// they throw so we do not need a try/catch block in each one.
const route = (handler) => (req, res) =>
  handler(req, res).catch((error) => {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  });

// Checks the token sent by the admin panel. Runs before protected routes.
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Please sign in again' });
  }
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

app.post(
  '/api/login',
  route(async (req, res) => {
    const { email, password } = req.body;

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    // Compare the typed password against the stored hash.
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, name: user.name });
  })
);

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

app.get(
  '/api/services',
  route(async (req, res) => {
    const [services] = await pool.query('SELECT * FROM services ORDER BY sortOrder');
    res.json(services);
  })
);

// ---------------------------------------------------------------------------
// Portfolio projects
// ---------------------------------------------------------------------------

app.get(
  '/api/projects',
  route(async (req, res) => {
    const [projects] = await pool.query('SELECT * FROM projects ORDER BY `year` DESC, id');
    res.json(projects);
  })
);

app.get(
  '/api/projects/:slug',
  route(async (req, res) => {
    const [projects] = await pool.query('SELECT * FROM projects WHERE slug = ?', [req.params.slug]);
    if (projects.length === 0) return res.status(404).json({ error: 'Project not found' });

    const [work] = await pool.query(
      'SELECT description FROM projectWork WHERE projectId = ? ORDER BY id',
      [projects[0].id]
    );

    res.json({ ...projects[0], work: work.map((row) => row.description) });
  })
);

// ---------------------------------------------------------------------------
// Marketplace listings
// ---------------------------------------------------------------------------

// Only these three sort options are allowed. The value from the browser is
// never put into the SQL directly, which stops anyone injecting their own.
const SORT_OPTIONS = {
  newest: 'createdAt DESC',
  cheapest: 'price ASC',
  dearest: 'price DESC',
};

app.get(
  '/api/listings',
  route(async (req, res) => {
    const { search, category, make, sort } = req.query;

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

    const [listings] = await pool.query(
      `SELECT * FROM listings ${where} ORDER BY ${orderBy}`,
      values
    );

    // The dropdown options on the filter sidebar.
    const [categories] = await pool.query('SELECT DISTINCT category FROM listings ORDER BY category');
    const [makes] = await pool.query('SELECT DISTINCT make FROM listings ORDER BY make');

    res.json({
      listings,
      categories: categories.map((row) => row.category),
      makes: makes.map((row) => row.make),
    });
  })
);

app.get(
  '/api/listings/:id',
  route(async (req, res) => {
    const [listings] = await pool.query('SELECT * FROM listings WHERE id = ?', [req.params.id]);
    if (listings.length === 0) return res.status(404).json({ error: 'Listing not found' });
    res.json(listings[0]);
  })
);

app.post(
  '/api/listings',
  requireAdmin,
  route(async (req, res) => {
    const l = req.body;
    const [result] = await pool.query(
      `INSERT INTO listings
       (title, category, make, fitment, partNumber, itemCondition, price, quantity, status, description, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [
        l.title,
        l.category,
        l.make,
        l.fitment,
        l.partNumber,
        l.itemCondition,
        l.price,
        l.quantity,
        l.status,
        l.description,
      ]
    );
    res.status(201).json({ id: result.insertId });
  })
);

app.put(
  '/api/listings/:id',
  requireAdmin,
  route(async (req, res) => {
    const l = req.body;
    await pool.query(
      `UPDATE listings SET
       title = ?, category = ?, make = ?, fitment = ?, partNumber = ?,
       itemCondition = ?, price = ?, quantity = ?, status = ?, description = ?
       WHERE id = ?`,
      [
        l.title,
        l.category,
        l.make,
        l.fitment,
        l.partNumber,
        l.itemCondition,
        l.price,
        l.quantity,
        l.status,
        l.description,
        req.params.id,
      ]
    );
    res.json({ ok: true });
  })
);

app.delete(
  '/api/listings/:id',
  requireAdmin,
  route(async (req, res) => {
    await pool.query('DELETE FROM listings WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  })
);

// ---------------------------------------------------------------------------
// Parts wanted
// ---------------------------------------------------------------------------

app.get(
  '/api/wanted',
  route(async (req, res) => {
    const [posts] = await pool.query('SELECT * FROM wanted ORDER BY createdAt DESC');
    res.json(posts);
  })
);

app.post(
  '/api/wanted',
  route(async (req, res) => {
    const p = req.body;
    await pool.query(
      `INSERT INTO wanted (title, make, postedBy, contact, budget, description, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, CURDATE())`,
      [p.title, p.make || '', p.postedBy, 'Via site enquiry', p.budget || '', p.description]
    );
    res.status(201).json({ ok: true });
  })
);

app.delete(
  '/api/wanted/:id',
  requireAdmin,
  route(async (req, res) => {
    await pool.query('DELETE FROM wanted WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  })
);

// ---------------------------------------------------------------------------
// Parts exchange
// ---------------------------------------------------------------------------

app.get(
  '/api/exchanges',
  route(async (req, res) => {
    const [posts] = await pool.query('SELECT * FROM exchanges ORDER BY createdAt DESC');
    res.json(posts);
  })
);

app.post(
  '/api/exchanges',
  route(async (req, res) => {
    const p = req.body;
    await pool.query(
      `INSERT INTO exchanges (title, make, postedBy, contact, offering, wanting, description, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [p.title, p.make || '', p.postedBy, 'Via site enquiry', p.offering, p.wanting, p.description || '']
    );
    res.status(201).json({ ok: true });
  })
);

app.delete(
  '/api/exchanges/:id',
  requireAdmin,
  route(async (req, res) => {
    await pool.query('DELETE FROM exchanges WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  })
);

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

app.get(
  '/api/testimonials',
  route(async (req, res) => {
    // The admin panel asks for every review; the public site only gets
    // the approved ones.
    const showAll = req.query.all === 'true';
    const [testimonials] = await pool.query(
      showAll
        ? 'SELECT * FROM testimonials ORDER BY createdAt DESC'
        : 'SELECT * FROM testimonials WHERE approved = 1 ORDER BY createdAt DESC'
    );
    res.json(testimonials);
  })
);

app.patch(
  '/api/testimonials/:id',
  requireAdmin,
  route(async (req, res) => {
    await pool.query('UPDATE testimonials SET approved = ? WHERE id = ?', [
      req.body.approved ? 1 : 0,
      req.params.id,
    ]);
    res.json({ ok: true });
  })
);

// ---------------------------------------------------------------------------
// Enquiries
// ---------------------------------------------------------------------------

app.post(
  '/api/enquiries',
  route(async (req, res) => {
    const e = req.body;
    await pool.query(
      `INSERT INTO enquiries (type, name, email, phone, vehicle, subject, message, listingId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        e.type || 'General',
        e.name,
        e.email,
        e.phone || '',
        e.vehicle || '',
        e.subject,
        e.message,
        e.listingId || null,
      ]
    );
    res.status(201).json({ ok: true });
  })
);

app.get(
  '/api/enquiries',
  requireAdmin,
  route(async (req, res) => {
    const [enquiries] = await pool.query('SELECT * FROM enquiries ORDER BY createdAt DESC');
    res.json(enquiries);
  })
);

app.patch(
  '/api/enquiries/:id',
  requireAdmin,
  route(async (req, res) => {
    await pool.query('UPDATE enquiries SET status = ? WHERE id = ?', [
      req.body.status,
      req.params.id,
    ]);
    res.json({ ok: true });
  })
);

// ---------------------------------------------------------------------------
// Admin dashboard counts
// ---------------------------------------------------------------------------

app.get(
  '/api/stats',
  requireAdmin,
  route(async (req, res) => {
    // COUNT and SUM are done by MySQL rather than by loading every row
    // into Node and counting there.
    const [[listings]] = await pool.query(
      `SELECT COUNT(*) AS total,
              SUM(status = 'available') AS available,
              SUM(CASE WHEN status = 'available' THEN price * quantity ELSE 0 END) AS stockValue
       FROM listings`
    );
    const [[enquiries]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(status = 'new') AS unread FROM enquiries`
    );
    const [[wanted]] = await pool.query('SELECT COUNT(*) AS total FROM wanted');
    const [[exchanges]] = await pool.query('SELECT COUNT(*) AS total FROM exchanges');
    const [[pending]] = await pool.query(
      'SELECT COUNT(*) AS total FROM testimonials WHERE approved = 0'
    );

    res.json({
      listings: Number(listings.total),
      available: Number(listings.available),
      stockValue: Number(listings.stockValue),
      enquiries: Number(enquiries.total),
      unread: Number(enquiries.unread),
      posts: Number(wanted.total) + Number(exchanges.total),
      pendingReviews: Number(pending.total),
    });
  })
);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
