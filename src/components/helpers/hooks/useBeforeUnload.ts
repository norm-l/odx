import { useEffect, useRef } from 'react';

export default function useBeforeUnload(fn) {
  const cb = useRef(fn);

  useEffect(() => {
    const handleBeforeUnload = cb.current;

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [cb]);
}
