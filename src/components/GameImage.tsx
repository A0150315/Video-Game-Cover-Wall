import { useState, useMemo } from 'react';

interface Props {
  primaryUrls: string[];
  fallbackUrls?: string[];
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}

export default function GameImage({ primaryUrls, fallbackUrls = [], alt, className, style, loading }: Props) {
  // Build a shuffled chain: random primary → rest of primary → fallbacks
  const urlChain = useMemo(() => {
    const chain: string[] = [];
    if (primaryUrls.length) {
      // Shuffle so each render picks a different starting image
      const shuffled = [...primaryUrls].sort(() => Math.random() - 0.5);
      chain.push(...shuffled);
    }
    if (fallbackUrls.length) {
      chain.push(...fallbackUrls.sort(() => Math.random() - 0.5));
    }
    return chain;
  }, [primaryUrls, fallbackUrls]);

  const [step, setStep] = useState(0);

  if (step >= urlChain.length || !urlChain.length) {
    return (
      <div className={`flex items-center justify-center bg-neutral-800 ${className ?? ''}`} style={style}>
        <p className="text-neutral-500 text-xs text-center px-2 leading-tight truncate">{alt}</p>
      </div>
    );
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
