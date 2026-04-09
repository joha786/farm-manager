import { useState } from 'react';
import { fallbackFarmImage, farmImageUrl } from '../utils/images';

export default function FarmImage({ type, name, className = '' }) {
  const [src, setSrc] = useState(farmImageUrl(type));
  const fallback = fallbackFarmImage(type);

  return (
    <img
      className={className}
      src={src}
      alt={`${type || 'Farm'} image${name ? ` for ${name}` : ''}`}
      loading="lazy"
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}
