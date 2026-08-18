import { useEffect, useRef } from 'react';
import { createCoverWall } from '../three/CoverWall';

export default function CoverWallCanvas({ posters }: { posters: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || posters.length === 0) return;
    const wall = createCoverWall(container, posters);
    return () => wall.dispose();
  }, [posters]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
