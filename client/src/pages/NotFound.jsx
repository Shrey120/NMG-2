import { Button } from '../components/ui.jsx';

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-xl place-items-center px-4 py-32 text-center">
      <p className="font-mono text-6xl font-black text-edge">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted">
        That page does not exist. It may have been moved, or the link may be out of date.
      </p>
      <Button as="link" to="/" className="mt-8">
        Back to home
      </Button>
    </div>
  );
}
