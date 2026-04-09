const FARM_IMAGES = {
  'Cow Farm':
    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80',
  'Poultry Farm':
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80',
  'Goose Farm':
    'https://images.unsplash.com/photo-1563487097677-5233a8377f46?auto=format&fit=crop&w=1200&q=80',
  'Fish Farm':
    'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=1200&q=80',
  'Rice Field':
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  'Potato Field':
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80',
  'Tomato Field':
    'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=80'
};

const FALLBACK_COLORS = {
  'Cow Farm': ['#2f7d5c', '#e7f0df', '#2d2b28'],
  'Poultry Farm': ['#d68c45', '#fff0cf', '#6d3d21'],
  'Goose Farm': ['#4d8fb7', '#eaf7f7', '#244a56'],
  'Fish Farm': ['#277da1', '#d9f4f6', '#174f63'],
  'Rice Field': ['#667a3d', '#e6f4cf', '#2f5f44'],
  'Potato Field': ['#9b7358', '#f4dfc6', '#5b3b2e'],
  'Tomato Field': ['#b44f64', '#ffe2df', '#35643f']
};

export function farmImageUrl(type) {
  return FARM_IMAGES[type] || FARM_IMAGES['Rice Field'];
}

export function fallbackFarmImage(type) {
  const [primary, soft, dark] = FALLBACK_COLORS[type] || FALLBACK_COLORS['Rice Field'];
  const label = type || 'Farm';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
      <defs>
        <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${soft}"/>
          <stop offset="1" stop-color="${primary}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="760" fill="url(#sky)"/>
      <circle cx="965" cy="150" r="78" fill="#ffd36e" opacity="0.9"/>
      <path d="M0 455 C170 395 300 505 475 430 C675 345 800 435 1200 375 L1200 760 L0 760 Z" fill="${dark}" opacity="0.85"/>
      <path d="M0 575 C180 515 360 610 560 548 C780 478 955 550 1200 505 L1200 760 L0 760 Z" fill="${primary}" opacity="0.95"/>
      <path d="M170 425 L330 315 L490 425 Z" fill="#ffffff" opacity="0.82"/>
      <path d="M218 425 L218 560 L442 560 L442 425 Z" fill="#ffffff" opacity="0.75"/>
      <path d="M278 560 L278 470 L370 470 L370 560 Z" fill="${dark}" opacity="0.72"/>
      <text x="70" y="120" fill="${dark}" font-family="Arial, sans-serif" font-size="54" font-weight="800">${label}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
