import * as seed from './data/seed.js';

// In-memory store. Everything resets when the server restarts — deliberate for
// a prototype. Swapping this file for Prisma/Supabase queries is the only
// change the route handlers should need.
const clone = (v) => JSON.parse(JSON.stringify(v));

export const store = {
  business: clone(seed.business),
  services: clone(seed.services),
  projects: clone(seed.projects),
  listings: clone(seed.listings),
  wanted: clone(seed.wanted),
  exchanges: clone(seed.exchanges),
  testimonials: clone(seed.testimonials),
  enquiries: clone(seed.enquiries),
  collaborations: clone(seed.collaborations),
};

export function reset() {
  store.business = clone(seed.business);
  store.services = clone(seed.services);
  store.projects = clone(seed.projects);
  store.listings = clone(seed.listings);
  store.wanted = clone(seed.wanted);
  store.exchanges = clone(seed.exchanges);
  store.testimonials = clone(seed.testimonials);
  store.enquiries = clone(seed.enquiries);
  store.collaborations = clone(seed.collaborations);
}

let counter = 1000;
export function nextId(prefix) {
  counter += 1;
  return `${prefix}-${counter}`;
}
