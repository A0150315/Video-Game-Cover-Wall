import { useState, useRef } from 'react';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  primaryUrls: string[];
  fallbackUrls?: string[];
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  onAllFailed?: () => void;
}

export default function GameImage({ primaryUrls, fallbackUrls = [], alt, className, style, loading, onAllFailed }: Props) {
  const [urlChain] = useState(() => [
    ...shuffle(primaryUrls),
    ...shuffle(fallbackUrls),
  ]);
  const [step, setStep] = useState(0);
  const failedRef = useRef(false);

  if (step >= urlChain.length || !urlChain.length) {
    if (!failedRef.current && onAllFailed) {
      failedRef.current = true;
      setTimeout(onAllFailed, 0);
    }
    return null;
  }

  return (
    <img
      src={urlChain[step]}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={() => setStep(prev => prev + 1)}
    />
  );
}
