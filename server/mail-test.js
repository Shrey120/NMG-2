// Sends one test email to the address in Admin panel -> Business details,
// using the mail settings in server/.env. Run it with:  npm run mail:test
import './env.js';
import { transport, ownerAddress } from './mail.js';

if (!process.env.MAIL_HOST) {
  console.log('MAIL_HOST is blank in server/.env, so the website is not sending email.');
  console.log('Fill in the four MAIL_ lines. See docs/email-setup.md.');
  process.exit(1);
}

const to = await ownerAddress();
console.log(`Sending a test email from ${process.env.MAIL_USER} to ${to} ...`);

try {
  await transport.verify();
  await transport.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: 'Outlier Autowerke - email is working',
    text: 'The website can send email. Booking and contact emails will arrive at this address.',
  });
  console.log(`Sent. Check the inbox for ${to}.`);
  process.exit(0);
} catch (err) {
  console.log('\nIt did not work:', err.message);
  if (/Invalid login|Username and Password not accepted|535/i.test(err.message)) {
    console.log('The password was refused. For Gmail, MAIL_PASSWORD must be a 16 letter');
    console.log('App Password, not your normal Gmail password. See docs/email-setup.md.');
  }
  if (/ECONNREFUSED|ETIMEDOUT|ENOTFOUND/i.test(err.message)) {
    console.log('Could not reach the mail server. Check MAIL_HOST and MAIL_PORT.');
  }
  process.exit(1);
}
