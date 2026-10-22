import { useCallback, useEffect, useRef, useState } from 'react';
import { MOCK_MODE } from '../services/api';

export function useApiData(loader, initialValue) {
  // In API mode, do not briefly paint local mock records before the real request resolves.
  const startingValue = MOCK_MODE || !Array.isArray(initialValue) ? initialValue : [];
  const [data, setData] = useState(startingValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const fallback = useRef(startingValue);

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
