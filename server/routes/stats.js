import express from 'express';
import { pool } from '../db.js';
import { requireStaff, route } from '../auth.js';

export const router = express.Router();

router.get(
  '/',
  requireStaff,
  route(async (req, res) => {
    // COUNT and SUM are done by MySQL rather than by loading every row into
    // Node and counting there.
    const [[listings]] = await pool.query(
      `SELECT COUNT(*) AS total,
              SUM(status = 'available') AS available,
              SUM(CASE WHEN status = 'available' THEN price * quantity ELSE 0 END) AS stockValue
       FROM listings`
    );
    const [[enquiries]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(status = 'new') AS unread FROM enquiries`
    );
    const [[bookings]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(status = 'requested') AS pending FROM bookings`
    );
    const [[offers]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(status = 'pending') AS pending FROM exchangeOffers`
    );
    const [[wanted]] = await pool.query(
      `SELECT COUNT(*) AS total, SUM(approved = 0) AS pending FROM wanted`
    );
    const [[reviews]] = await pool.query(
      'SELECT COUNT(*) AS pending FROM testimonials WHERE approved = 0'
    );

    res.json({
      listings: Number(listings.total),
      available: Number(listings.available),
      stockValue: Number(listings.stockValue),
      enquiries: Number(enquiries.total),
      unread: Number(enquiries.unread),
      bookings: Number(bookings.total),
      pendingBookings: Number(bookings.pending),
      offers: Number(offers.total),
      pendingOffers: Number(offers.pending),
      wanted: Number(wanted.total),
      pendingWanted: Number(wanted.pending),
      pendingReviews: Number(reviews.pending),
    });
  })
);
