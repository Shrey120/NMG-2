// Shows an uploaded picture when there is one. Until the client supplies
// photographs it falls back to a marked placeholder, so nothing on the page
// pretends to be a real photo of the car or part.
export default function Photo({ name, src, className = '' }) {
  if (src) {
    return (
      <img
        src={`/uploads/${src}`}
        alt={name}
        className={`photo ${className}`}
        style={{ objectFit: 'cover', display: 'block' }}
      />
    );
  }

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <div className={`photo ${className}`}>
      <span>{initials}</span>
      <small>Sample</small>
    </div>
  );
}
