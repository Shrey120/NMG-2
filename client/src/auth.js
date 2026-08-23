// Who is signed in, kept in localStorage so a refresh does not sign you out.
// The token itself is what the server checks; these helpers are only so the
// website can show the right menu items.

export function saveSignIn({ token, name, role }) {
  localStorage.setItem('token', token);
  localStorage.setItem('name', name);
  localStorage.setItem('role', role);
}

export function signOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  localStorage.removeItem('role');
}

export const isSignedIn = () => Boolean(localStorage.getItem('token'));
export const currentName = () => localStorage.getItem('name') || '';
export const currentRole = () => localStorage.getItem('role') || '';

// Staff and administrators can both reach the admin panel. Only an
// administrator can change services and portfolio projects.
export const isStaff = () => ['STAFF', 'ADMIN'].includes(currentRole());
export const isAdmin = () => currentRole() === 'ADMIN';
