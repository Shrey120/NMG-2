// Creates the database, builds the tables, loads the sample data and
// creates the admin login. Run it with: npm run db:setup
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import '../env.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dbName = process.env.DB_NAME || 'outlier_autowerke';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true, // needed so we can run a whole .sql file at once
});

console.log(`Creating database "${dbName}"...`);
await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
await connection.query(`USE \`${dbName}\``);

console.log('Creating tables...');
await connection.query(fs.readFileSync(path.join(here, 'schema.sql'), 'utf8'));

console.log('Loading sample data...');
await connection.query(fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'));

// Passwords are never stored as plain text. bcrypt turns the password into
// a hash that cannot be reversed; at login we hash the attempt and compare.
const email = process.env.ADMIN_EMAIL || 'admin@outlierautowerke.com';
const password = process.env.ADMIN_PASSWORD || 'admin1234';
const passwordHash = await bcrypt.hash(password, 10);

await connection.query(
  'INSERT INTO users (name, email, passwordHash, role) VALUES (?, ?, ?, ?)',
  [process.env.ADMIN_NAME || 'Workshop Admin', email, passwordHash, 'ADMIN']
);

await connection.end();

console.log('\nDone. Admin login:');
console.log(`  email:    ${email}`);
console.log(`  password: ${password}`);
