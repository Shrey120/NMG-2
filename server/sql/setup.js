// Creates the database, builds the tables, creates the accounts and loads the
// sample data. Run it with: npm run db:setup
//
// The accounts are created before the sample data, because sample wanted ads
// and swap offers refer to user ids.
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

// Passwords are never stored as plain text. bcrypt turns the password into a
// hash that cannot be reversed; at login we hash the attempt and compare.
async function createUser(name, email, password, role) {
  const passwordHash = await bcrypt.hash(password, 10);
  await connection.query(
    `INSERT INTO users (name, email, passwordHash, role, consentAt)
     VALUES (?, ?, ?, ?, NOW())`,
    [name, email, passwordHash, role]
  );
}

console.log('Creating accounts...');
const adminEmail = process.env.ADMIN_EMAIL || 'admin@outlierautowerke.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';

await createUser(process.env.ADMIN_NAME || 'Workshop Admin', adminEmail, adminPassword, 'ADMIN'); // id 1
await createUser('Workshop Staff', 'staff@outlierautowerke.com', 'staff1234', 'STAFF');           // id 2
await createUser('Daniel Reeve', 'daniel@example.com', 'customer1234', 'CUSTOMER');               // id 3
await createUser('Marcus Lowe', 'marcus@example.com', 'customer1234', 'CUSTOMER');                // id 4

console.log('Loading sample data...');
await connection.query(fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'));

await connection.end();

console.log(`
Done. Sign in with any of these:

  Administrator  ${adminEmail} / ${adminPassword}
  Staff          staff@outlierautowerke.com / staff1234
  Customer       daniel@example.com / customer1234
`);
