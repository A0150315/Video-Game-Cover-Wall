import { useRef } from 'react';

export default function Preloader({ urls }: { urls: string[] }) {
  const seenRef = useRef(new Set<string>());

  if (!urls.length) return null;

  return (
    <div aria-hidden className="hidden">
      {urls.map(url => {
        if (seenRef.current.has(url)) return null;
        seenRef.current.add(url);
        return <img key={url} src={url} alt="" />;
      })}
    </div>
  );
}
