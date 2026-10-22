import { useCallback, useEffect, useRef, useState } from 'react';

export function useApiData(loader, initialValue) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const fallback = useRef(initialValue);

  const reload = useCallback(() => setRevision(value => value + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loader().then(value => {
      if (active) { setData(value ?? fallback.current); setError(''); }
    }).catch(reason => {
      if (active) setError(reason.message || 'Could not load data.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [loader, revision]);

  return { data, setData, loading, error, reload };
}
