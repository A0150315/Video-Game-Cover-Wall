import { useState, useEffect } from 'react';

export function useImagePreload(urlChain: string[]) {
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setLoaded(false);
    setStep(0);
  }, [urlChain]);

  useEffect(() => {
    const url = urlChain[step];
    if (!url) return;

    const img = new Image();
    let cancelled = false;

    img.onload = () => {
      if (!cancelled) setLoaded(true);
    };
    img.onerror = () => {
      if (!cancelled) setStep(prev => prev + 1);
    };
    img.src = url;

    // Timeout: show anyway after 4s to avoid getting stuck
    const timeout = setTimeout(() => {
      if (!cancelled && !loaded) setLoaded(true);
    }, 4000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [urlChain, step]);

  return { loaded, imgFailed: step };
}
