import nodemailer from 'nodemailer';
import './env.js';
import { pool } from './db.js';

// Every message is written to the emailLog table first, then sent if a mail
// account has been configured. The client has not supplied one yet, so
// MAIL_HOST is blank and nothing actually leaves the building - but the log
// still shows the right message was produced at the right moment.
const canSend = Boolean(process.env.MAIL_HOST);

const transport = canSend
  ? nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
    })
  : null;

export const ownerAddress = () => process.env.MAIL_TO || 'owner@outlierautowerke.example';

async function send(to, subject, body, replyTo) {
  let delivered = false;

  if (canSend && to) {
    await transport.sendMail({
      from: process.env.MAIL_FROM || ownerAddress(),
      to,
      replyTo,
      subject,
      text: body,
    });
    delivered = true;
  } else {
    console.log(`\n--- email (not sent, no mail account) ---\nTo: ${to}\nSubject: ${subject}\n\n${body}\n---\n`);
  }

  await pool.query(
    'INSERT INTO emailLog (toAddress, subject, body, delivered) VALUES (?, ?, ?, ?)',
    [to, subject, body, delivered ? 1 : 0]
  );

  return delivered;
}

const when = (booking) => `${booking.bookingDate} at ${String(booking.slotTime).slice(0, 5)}`;

// --- Bookings --------------------------------------------------------------

// Goes to the owner. Carries the two links that let them decide without
// signing in.
export function emailOwnerNewBooking(booking, serviceTitle, baseUrl) {
  const accept = `${baseUrl}/api/bookings/action?token=${booking.actionToken}&do=accept`;
  const decline = `${baseUrl}/api/bookings/action?token=${booking.actionToken}&do=decline`;

  return send(
    ownerAddress(),
    `New booking request: ${serviceTitle} on ${when(booking)}`,
    [
      'A new booking request is waiting for you.',
      '',
      `Service:  ${serviceTitle}`,
      `When:     ${when(booking)}`,
      `Customer: ${booking.name}`,
      `Email:    ${booking.email}`,
      `Phone:    ${booking.phone || 'not given'}`,
      `Vehicle:  ${booking.vehicle}`,
      '',
      booking.notes ? `Notes: ${booking.notes}` : 'No notes given.',
      '',
      'Decide without signing in:',
      '',
      `  ACCEPT BOOKING   ${accept}`,
      `  DECLINE BOOKING  ${decline}`,
      '',
      'Each link works once. You can also decide in the admin panel.',
    ].join('\n'),
    booking.email
  );
}

// Goes to the customer straight away. Must be clear that nothing is confirmed.
export function emailCustomerPending(booking, serviceTitle) {
  return send(
    booking.email,
    `We have your booking request - ${serviceTitle}`,
    [
      `Hello ${booking.name},`,
      '',
      'Thank you for your booking request. We have received it.',
      '',
      '*** THIS BOOKING IS NOT YET CONFIRMED ***',
      'It is pending approval by the workshop. We will email you again once it',
      'has been accepted or declined.',
      '',
      `Service:   ${serviceTitle}`,
      `Requested: ${when(booking)}`,
      `Vehicle:   ${booking.vehicle}`,
      '',
      'Outlier Autowerke',
    ].join('\n')
  );
}

export function emailCustomerAccepted(booking, serviceTitle) {
  return send(
    booking.email,
    `Booking confirmed - ${serviceTitle} on ${when(booking)}`,
    [
      `Hello ${booking.name},`,
      '',
      'Good news. Your booking has been accepted and is now confirmed.',
      '',
      `Service: ${serviceTitle}`,
      `When:    ${when(booking)}`,
      `Vehicle: ${booking.vehicle}`,
      '',
      'The slot is reserved for you. If you need to change it, reply to this email.',
      '',
      'Outlier Autowerke',
    ].join('\n')
  );
}

export function emailCustomerDeclined(booking, serviceTitle) {
  return send(
    booking.email,
    `About your booking request - ${serviceTitle}`,
    [
      `Hello ${booking.name},`,
      '',
      'Unfortunately we are not able to take your booking for:',
      '',
      `Service: ${serviceTitle}`,
      `When:    ${when(booking)}`,
      '',
      'The time you asked for has not been held. You are very welcome to choose',
      'another time on the website, or reply to this email and we will find one',
      'that works.',
      '',
      'Outlier Autowerke',
    ].join('\n')
  );
}

// --- Enquiries -------------------------------------------------------------

export function emailOwnerEnquiry(enquiry) {
  return send(
    ownerAddress(),
    `Website enquiry: ${enquiry.subject}`,
    [
      `Type:    ${enquiry.type}`,
      `From:    ${enquiry.name} <${enquiry.email}>`,
      `Phone:   ${enquiry.phone || 'not given'}`,
      `Vehicle: ${enquiry.vehicle || 'not given'}`,
      '',
      enquiry.message,
    ].join('\n'),
    enquiry.email
  );
}

export function emailCustomerEnquiryAck(enquiry) {
  return send(
    enquiry.email,
    'We have your enquiry - Outlier Autowerke',
    [
      `Hello ${enquiry.name},`,
      '',
      'Thank you for getting in touch. Your enquiry has reached the workshop and',
      'someone will reply to you shortly.',
      '',
      'This is an automatic acknowledgement, not an answer to your question.',
      '',
      `Your message: ${enquiry.subject}`,
      '',
      'Outlier Autowerke',
    ].join('\n')
  );
}
