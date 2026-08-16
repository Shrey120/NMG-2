const BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('oa_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

const qs = (params = {}) => {
  const clean = Object.entries(params).filter(([, v]) => v !== '' && v != null);
  return clean.length ? `?${new URLSearchParams(clean)}` : '';
};

export const api = {
  business: () => request('/business'),
  services: () => request('/services'),
  collaborations: () => request('/collaborations'),

  projects: (params) => request(`/projects${qs(params)}`),
  project: (slug) => request(`/projects/${slug}`),

  listings: (params) => request(`/listings${qs(params)}`),
  listing: (id) => request(`/listings/${id}`),
  createListing: (data) => request('/listings', { method: 'POST', body: JSON.stringify(data) }),
  updateListing: (id, data) => request(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteListing: (id) => request(`/listings/${id}`, { method: 'DELETE' }),

  wanted: () => request('/wanted'),
  createWanted: (data) => request('/wanted', { method: 'POST', body: JSON.stringify(data) }),
  deleteWanted: (id) => request(`/wanted/${id}`, { method: 'DELETE' }),

  exchanges: () => request('/exchanges'),
  createExchange: (data) => request('/exchanges', { method: 'POST', body: JSON.stringify(data) }),
  deleteExchange: (id) => request(`/exchanges/${id}`, { method: 'DELETE' }),

  testimonials: (all) => request(`/testimonials${all ? '?all=true' : ''}`),
  approveTestimonial: (id, approved) =>
    request(`/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify({ approved }) }),

  sendEnquiry: (data) => request('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  enquiries: () => request('/enquiries'),
  updateEnquiry: (id, status) =>
    request(`/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  stats: () => request('/admin/stats'),
  resetData: () => request('/admin/reset', { method: 'POST' }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

export const money = (n) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n);
