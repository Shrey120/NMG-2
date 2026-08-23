import nodemailer from 'nodemailer';
import './env.js';

// The client asked for enquiries to go to an email address as well as the
// dashboard. Until they tell us which address and give us a mail account,
// MAIL_HOST is left blank and we log the message instead of sending it.
// Nothing else in the app has to change when the details arrive.
const canSend = Boolean(process.env.MAIL_HOST);

const transport = canSend
  ? nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
    })
  : null;

export async function sendEnquiryEmail(enquiry) {
  const to = process.env.MAIL_TO;
  const text = [
    `Type: ${enquiry.type}`,
    `From: ${enquiry.name} <${enquiry.email}>`,
    `Phone: ${enquiry.phone || 'not given'}`,
    `Vehicle: ${enquiry.vehicle || 'not given'}`,
    '',
    enquiry.message,
  ].join('\n');

  if (!canSend || !to) {
    console.log(`[email not sent - no mail account configured]\nTo: ${to || 'unset'}\nSubject: ${enquiry.subject}\n${text}\n`);
    return { sent: false };
  }

  await transport.sendMail({
    from: process.env.MAIL_FROM || to,
    to,
    replyTo: enquiry.email,
    subject: `Website enquiry: ${enquiry.subject}`,
    text,
  });

  return { sent: true };
}
