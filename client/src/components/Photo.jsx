// Stands in for a real photograph until the client sends theirs.
// Shows the first letters of the name so cards look different from each other.
export default function Photo({ name, className = '' }) {
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
