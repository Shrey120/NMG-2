import mysql from 'mysql2/promise';
import './env.js';

// A pool keeps a small set of open connections and hands them out as
// requests come in, instead of opening a new connection every time.
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'outlier_autowerke',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true, // return DATE columns as "2026-07-28" instead of a JS Date
});
