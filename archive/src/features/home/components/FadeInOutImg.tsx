import React, { ImgHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';

export const FadeInOutImg: React.FC<ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  const { src } = props;
  const imageRef = useRef<HTMLImageElement>(null);

  const [curSrc, setCurSrc] = useState(src);
  const [opacity, setOpacity] = useState(0);

  const transitionStart = useCallback(() => {
    setOpacity(1);
    setTimeout(() => {
      setCurSrc(src);
    }, 300);
  }, [src]);

  useEffect(() => {
    if (src !== curSrc) {
      transitionStart();
    }
  }, [curSrc, src, transitionStart]);

  return (
    <div style={{ position: 'relative' }}>
      <img
        ref={imageRef}
        {...props}
        alt={props.alt}
        src={src}
        style={{
          ...props.style,
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: opacity,
          height: '100%',
          width: '100%',
          transition: 'opacity 0.3s',
        }}
      />
      <img {...props} alt={props.alt} src={curSrc} />
    </div>
  );
};
