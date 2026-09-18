// Checks the mail settings in server/.env by sending one real email.
// Run it with:  npm run mail:test
import './env.js';
import { transport } from './mail.js';

const to = process.env.MAIL_TO;

// Blank is a valid choice, not a mistake: emails are produced and listed in
// the admin panel without being sent. See Option A in docs/email-setup.md.
if (!process.env.MAIL_HOST) {
  console.log('Email sending is off, because MAIL_HOST is blank in server/.env.');
  console.log('That is fine: every email is listed under Admin panel -> Sent emails,');
  console.log('and the Accept and Decline links work from there.');
  console.log('To send real email through Gmail, see docs/email-setup.md, Option B.');
  process.exit(0);
}
if (!to) {
  console.log('MAIL_TO is blank. Set it to the address that should receive the test.');
  process.exit(1);
}

console.log(`Connecting to ${process.env.MAIL_HOST}:${process.env.MAIL_PORT || 587} ...`);

try {
  await transport.verify();
  console.log('Connected and signed in.');

  await transport.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER || to,
    to,
    subject: 'Outlier Autowerke - mail settings work',
    text: 'If you can read this, the website can send email. Nothing else to do.',
  });

  console.log(`Sent. Check the inbox for ${to}.`);
  process.exit(0);
} catch (err) {
  console.log('\nIt did not work:', err.message);

  // The two mistakes almost everyone makes, explained in plain words.
  if (/Invalid login|Username and Password not accepted|535/i.test(err.message)) {
    console.log('\nThe password was refused. For Gmail this must be a 16 letter App');
    console.log('Password, not your normal Gmail password. See docs/email-setup.md step 2.');
  }
  if (/ECONNREFUSED|ETIMEDOUT|ENOTFOUND/i.test(err.message)) {
    console.log('\nCould not reach the mail server. Check MAIL_HOST and MAIL_PORT.');
  }
  process.exit(1);
}
