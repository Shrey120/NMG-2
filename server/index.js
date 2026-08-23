import express from 'express';
import cors from 'cors';
import './env.js';
import { uploadsPath } from './upload.js';

import { router as auth } from './routes/auth.js';
import { router as business } from './routes/business.js';
import { router as services } from './routes/services.js';
import { router as projects } from './routes/projects.js';
import { router as listings } from './routes/listings.js';
import { router as wanted } from './routes/wanted.js';
import { router as exchange } from './routes/exchange.js';
import { router as bookings } from './routes/bookings.js';
import { router as enquiries } from './routes/enquiries.js';
import { router as testimonials } from './routes/testimonials.js';
import { router as stats } from './routes/stats.js';

const app = express();
const PORT = process.env.PORT || 4100;

app.use(cors());
app.use(express.json());

// Photos attached to enquiries are read back from here.
app.use('/uploads', express.static(uploadsPath));

// Each file below handles one part of the site.
app.use('/api', auth); // /api/register, /api/login, /api/me
app.use('/api/business', business);
app.use('/api/services', services);
app.use('/api/projects', projects);
app.use('/api/listings', listings);
app.use('/api/wanted', wanted);
app.use('/api/exchanges', exchange);
app.use('/api/bookings', bookings);
app.use('/api/enquiries', enquiries);
app.use('/api/testimonials', testimonials);
app.use('/api/stats', stats);

// Anything that reaches here is a request for a route that does not exist.
app.use('/api', (req, res) => res.status(404).json({ error: 'Unknown endpoint' }));

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
