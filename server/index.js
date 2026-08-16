import express from 'express';
import cors from 'cors';
import { store, nextId, reset } from './store.js';

const app = express();
const PORT = process.env.PORT || 4100;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Auth — PROTOTYPE ONLY.
//
// This is a hardcoded credential check that returns a static token. It exists
// so the admin panel can be demonstrated. Before this goes anywhere near real
// use it must be replaced with Supabase Auth (hashed passwords, real sessions,
// row level security). Do not copy this pattern forward.
// ---------------------------------------------------------------------------
const DEMO_ADMIN = { email: 'admin@outlierautowerke.example', password: 'prototype' };
const DEMO_TOKEN = 'prototype-admin-token';

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  if (header.replace('Bearer ', '') !== DEMO_TOKEN) {
    return res.status(401).json({ error: 'Not authorised' });
  }
  next();
}

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
    return res.json({ token: DEMO_TOKEN, user: { email, role: 'ADMIN', name: 'Workshop Admin' } });
  }
  res.status(401).json({ error: 'Incorrect email or password' });
});

// --- Public content -------------------------------------------------------

app.get('/api/business', (_req, res) => res.json(store.business));
app.get('/api/services', (_req, res) => res.json(store.services));
app.get('/api/collaborations', (_req, res) => res.json(store.collaborations));

app.get('/api/projects', (req, res) => {
  const { make, category } = req.query;
  let out = [...store.projects];
  if (make) out = out.filter((p) => p.make === make);
  if (category) out = out.filter((p) => p.category === category);
  res.json(out);
});

app.get('/api/projects/:slug', (req, res) => {
  const project = store.projects.find((p) => p.slug === req.params.slug);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

app.get('/api/testimonials', (req, res) => {
  const all = req.query.all === 'true';
  res.json(all ? store.testimonials : store.testimonials.filter((t) => t.approved));
});

// --- Marketplace ----------------------------------------------------------

app.get('/api/listings', (req, res) => {
  const { q, category, make, condition, minPrice, maxPrice, sort, status } = req.query;
  let out = [...store.listings];

  if (q) {
    const needle = q.toLowerCase();
    out = out.filter((l) =>
      [l.title, l.description, l.partNumber, l.fitment, l.category, l.make]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }
  if (category) out = out.filter((l) => l.category === category);
  if (make) out = out.filter((l) => l.make === make);
  if (condition) out = out.filter((l) => l.condition === condition);
  if (status) out = out.filter((l) => l.status === status);
  if (minPrice) out = out.filter((l) => l.price >= Number(minPrice));
  if (maxPrice) out = out.filter((l) => l.price <= Number(maxPrice));

  if (sort === 'price-asc') out.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') out.sort((a, b) => b.price - a.price);
  else out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  res.json({
    items: out,
    total: out.length,
    facets: {
      categories: [...new Set(store.listings.map((l) => l.category))].sort(),
      makes: [...new Set(store.listings.map((l) => l.make))].sort(),
      conditions: [...new Set(store.listings.map((l) => l.condition))].sort(),
    },
  });
});

app.get('/api/listings/:id', (req, res) => {
  const listing = store.listings.find((l) => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  res.json(listing);
});

app.post('/api/listings', requireAdmin, (req, res) => {
  const listing = {
    id: nextId('lst'),
    status: 'available',
    quantity: 1,
    createdAt: new Date().toISOString().slice(0, 10),
    ...req.body,
    price: Number(req.body.price) || 0,
  };
  store.listings.unshift(listing);
  res.status(201).json(listing);
});

app.put('/api/listings/:id', requireAdmin, (req, res) => {
  const index = store.listings.findIndex((l) => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Listing not found' });
  store.listings[index] = {
    ...store.listings[index],
    ...req.body,
    id: store.listings[index].id,
    price: Number(req.body.price ?? store.listings[index].price) || 0,
  };
  res.json(store.listings[index]);
});

app.delete('/api/listings/:id', requireAdmin, (req, res) => {
  const index = store.listings.findIndex((l) => l.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Listing not found' });
  const [removed] = store.listings.splice(index, 1);
  res.json(removed);
});

// --- Parts wanted / exchange ---------------------------------------------

app.get('/api/wanted', (_req, res) => res.json(store.wanted));

app.post('/api/wanted', (req, res) => {
  const post = {
    id: nextId('wtd'),
    isStaff: false,
    status: 'open',
    postedBy: req.body.postedBy || 'Site visitor',
    contact: 'Via site enquiry',
    createdAt: new Date().toISOString().slice(0, 10),
    ...req.body,
  };
  store.wanted.unshift(post);
  res.status(201).json(post);
});

app.delete('/api/wanted/:id', requireAdmin, (req, res) => {
  const index = store.wanted.findIndex((w) => w.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Post not found' });
  res.json(store.wanted.splice(index, 1)[0]);
});

app.get('/api/exchanges', (_req, res) => res.json(store.exchanges));

app.post('/api/exchanges', (req, res) => {
  const post = {
    id: nextId('exc'),
    isStaff: false,
    status: 'open',
    postedBy: req.body.postedBy || 'Site visitor',
    contact: 'Via site enquiry',
    createdAt: new Date().toISOString().slice(0, 10),
    ...req.body,
  };
  store.exchanges.unshift(post);
  res.status(201).json(post);
});

app.delete('/api/exchanges/:id', requireAdmin, (req, res) => {
  const index = store.exchanges.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Post not found' });
  res.json(store.exchanges.splice(index, 1)[0]);
});

// --- Enquiries ------------------------------------------------------------

app.post('/api/enquiries', (req, res) => {
  const enquiry = {
    id: nextId('enq'),
    status: 'new',
    listingId: null,
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  store.enquiries.unshift(enquiry);
  // Real build: also send to the client's nominated address (question D2).
  console.log(`[enquiry] ${enquiry.name} — ${enquiry.subject}`);
  res.status(201).json({ ok: true, id: enquiry.id });
});

app.get('/api/enquiries', requireAdmin, (_req, res) => res.json(store.enquiries));

app.patch('/api/enquiries/:id', requireAdmin, (req, res) => {
  const enquiry = store.enquiries.find((e) => e.id === req.params.id);
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
  Object.assign(enquiry, { status: req.body.status ?? enquiry.status });
  res.json(enquiry);
});

// --- Testimonial moderation ----------------------------------------------

app.post('/api/testimonials', (req, res) => {
  const testimonial = {
    id: nextId('tst'),
    approved: false,
    rating: Number(req.body.rating) || 5,
    date: new Date().toISOString().slice(0, 10),
    ...req.body,
  };
  store.testimonials.push(testimonial);
  res.status(201).json({ ok: true });
});

app.patch('/api/testimonials/:id', requireAdmin, (req, res) => {
  const testimonial = store.testimonials.find((t) => t.id === req.params.id);
  if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
  testimonial.approved = Boolean(req.body.approved);
  res.json(testimonial);
});

// --- Admin dashboard ------------------------------------------------------

app.get('/api/admin/stats', requireAdmin, (_req, res) => {
  res.json({
    listings: {
      total: store.listings.length,
      available: store.listings.filter((l) => l.status === 'available').length,
      sold: store.listings.filter((l) => l.status === 'sold').length,
      value: store.listings
        .filter((l) => l.status === 'available')
        .reduce((sum, l) => sum + l.price * l.quantity, 0),
    },
    enquiries: {
      total: store.enquiries.length,
      unread: store.enquiries.filter((e) => e.status === 'new').length,
    },
    wanted: store.wanted.filter((w) => w.status === 'open').length,
    exchanges: store.exchanges.filter((e) => e.status === 'open').length,
    projects: store.projects.length,
    pendingTestimonials: store.testimonials.filter((t) => !t.approved).length,
  });
});

app.post('/api/admin/reset', requireAdmin, (_req, res) => {
  reset();
  res.json({ ok: true, message: 'Sample data restored' });
});

app.listen(PORT, () => {
  console.log(`Outlier Autowerke API (prototype) → http://localhost:${PORT}`);
});
