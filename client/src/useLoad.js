import { useState, useEffect } from 'react';
import { get } from './api.js';

// Loads data from the API when a page opens.
//
//   const { data, loading, reload } = useLoad('/services');
//
// Call reload() after saving something to fetch the fresh version.
export function useLoad(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    get(path)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // If the user leaves the page before the request finishes, ignore it.
    return () => {
      cancelled = true;
    };
  }, [path, counter]);

  return { data, loading, reload: () => setCounter((n) => n + 1) };
}
