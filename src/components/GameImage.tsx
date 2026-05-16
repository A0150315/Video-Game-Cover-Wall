import { useState } from 'react';

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
}

export default function GameImage({ primaryUrls, fallbackUrls = [], alt, className, style, loading }: Props) {
  // Shuffle on mount: random primary → rest primary → random fallbacks
  const [urlChain] = useState(() => [
    ...shuffle(primaryUrls),
    ...shuffle(fallbackUrls),
  ]);

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
