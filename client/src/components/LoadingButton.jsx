export default function LoadingButton({ loading, children, ...props }) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading && <span className="spinner" aria-hidden="true" />}
      {loading ? 'Sending...' : children}
    </button>
  );
}