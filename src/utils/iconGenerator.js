/**
 * PWA Icon Generator Utilities
 * Creates SVG-based icons for the Heritage Web PWA
 */

// Heritage brand colors
const COLORS = {
  red: {
    primary: '#b91c1c',
    dark: '#991b1b',
    light: '#dc2626',
  },
  gold: {
    primary: '#f59e0b',
    dark: '#d97706',
    light: '#fbbf24',
  },
  white: '#ffffff',
  gray: {
    dark: '#1f2937',
    light: '#f3f4f6',
  },
};

/**
 * Generate the main app icon SVG
 * @param {number} size - Icon size in pixels
 * @param {boolean} maskable - Whether to add safe zone padding for maskable icons
 * @returns {string} SVG string
 */
export function generateAppIconSVG(size = 512, maskable = false) {
  const padding = maskable ? size * 0.1 : 0;
  const iconSize = size - padding * 2;
  const centerX = size / 2;
  const centerY = size / 2;
  const landmarkSize = iconSize * 0.45;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${COLORS.red.primary}"/>
      <stop offset="100%" style="stop-color:${COLORS.red.dark}"/>
    </linearGradient>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${COLORS.gold.light}"/>
      <stop offset="100%" style="stop-color:${COLORS.gold.primary}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${size * 0.01}" stdDeviation="${size * 0.02}" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bgGradient)"/>

  <!-- Gold circle background for icon -->
  <circle cx="${centerX}" cy="${centerY}" r="${iconSize * 0.32}" fill="url(#goldGradient)" filter="url(#shadow)"/>

  <!-- Landmark icon (simplified) -->
  <g transform="translate(${centerX - landmarkSize / 2}, ${centerY - landmarkSize / 2})" fill="${COLORS.red.dark}">
    <!-- Roof -->
    <polygon points="${landmarkSize / 2},${landmarkSize * 0.05} ${landmarkSize * 0.1},${landmarkSize * 0.35} ${landmarkSize * 0.9},${landmarkSize * 0.35}"/>

    <!-- Pillars -->
    <rect x="${landmarkSize * 0.18}" y="${landmarkSize * 0.38}" width="${landmarkSize * 0.12}" height="${landmarkSize * 0.45}" rx="${landmarkSize * 0.02}"/>
    <rect x="${landmarkSize * 0.44}" y="${landmarkSize * 0.38}" width="${landmarkSize * 0.12}" height="${landmarkSize * 0.45}" rx="${landmarkSize * 0.02}"/>
    <rect x="${landmarkSize * 0.70}" y="${landmarkSize * 0.38}" width="${landmarkSize * 0.12}" height="${landmarkSize * 0.45}" rx="${landmarkSize * 0.02}"/>

    <!-- Base -->
    <rect x="${landmarkSize * 0.08}" y="${landmarkSize * 0.85}" width="${landmarkSize * 0.84}" height="${landmarkSize * 0.1}" rx="${landmarkSize * 0.02}"/>
  </g>

  <!-- Decorative gold border -->
  <rect x="${size * 0.02}" y="${size * 0.02}" width="${size * 0.96}" height="${size * 0.96}" rx="${size * 0.14}" fill="none" stroke="${COLORS.gold.primary}" stroke-width="${size * 0.01}" opacity="0.5"/>
</svg>`;
}

/**
 * Generate a shortcut icon SVG
 * @param {string} type - Icon type: 'heritage', 'chat', 'quiz', 'audio'
 * @param {number} size - Icon size in pixels
 * @returns {string} SVG string
 */
export function generateShortcutIconSVG(type, size = 96) {
  const colors = {
    heritage: { bg: COLORS.red.primary, bgDark: COLORS.red.dark },
    chat: { bg: '#2563eb', bgDark: '#1d4ed8' },
    quiz: { bg: '#d97706', bgDark: '#b45309' },
    audio: { bg: '#7c3aed', bgDark: '#6d28d9' },
  };

  const iconColor = colors[type] || colors.heritage;
  const iconPath = getShortcutIconPath(type, size);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="shortcutBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${iconColor.bg}"/>
      <stop offset="100%" style="stop-color:${iconColor.bgDark}"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#shortcutBg)"/>

  <!-- Icon -->
  ${iconPath}
</svg>`;
}

/**
 * Get the path for a shortcut icon
 */
function getShortcutIconPath(type, size) {
  const iconSize = size * 0.5;
  const offset = (size - iconSize) / 2;
  const color = COLORS.white;

  switch (type) {
    case 'heritage':
      return `<g transform="translate(${offset}, ${offset})" fill="${color}">
        <polygon points="${iconSize / 2},${iconSize * 0.08} ${iconSize * 0.12},${iconSize * 0.38} ${iconSize * 0.88},${iconSize * 0.38}"/>
        <rect x="${iconSize * 0.2}" y="${iconSize * 0.42}" width="${iconSize * 0.12}" height="${iconSize * 0.4}" rx="${iconSize * 0.02}"/>
        <rect x="${iconSize * 0.44}" y="${iconSize * 0.42}" width="${iconSize * 0.12}" height="${iconSize * 0.4}" rx="${iconSize * 0.02}"/>
        <rect x="${iconSize * 0.68}" y="${iconSize * 0.42}" width="${iconSize * 0.12}" height="${iconSize * 0.4}" rx="${iconSize * 0.02}"/>
        <rect x="${iconSize * 0.1}" y="${iconSize * 0.85}" width="${iconSize * 0.8}" height="${iconSize * 0.1}" rx="${iconSize * 0.02}"/>
      </g>`;

    case 'chat':
      return `<g transform="translate(${offset}, ${offset})" fill="${color}">
        <rect x="${iconSize * 0.1}" y="${iconSize * 0.15}" width="${iconSize * 0.8}" height="${iconSize * 0.55}" rx="${iconSize * 0.1}"/>
        <polygon points="${iconSize * 0.25},${iconSize * 0.7} ${iconSize * 0.15},${iconSize * 0.9} ${iconSize * 0.45},${iconSize * 0.7}"/>
      </g>`;

    case 'quiz':
      return `<g transform="translate(${offset}, ${offset})" fill="${color}">
        <circle cx="${iconSize * 0.5}" cy="${iconSize * 0.35}" r="${iconSize * 0.28}" fill="none" stroke="${color}" stroke-width="${iconSize * 0.08}"/>
        <rect x="${iconSize * 0.44}" y="${iconSize * 0.5}" width="${iconSize * 0.12}" height="${iconSize * 0.25}"/>
        <circle cx="${iconSize * 0.5}" cy="${iconSize * 0.85}" r="${iconSize * 0.08}"/>
      </g>`;

    case 'audio':
      return `<g transform="translate(${offset}, ${offset})" fill="${color}">
        <polygon points="${iconSize * 0.15},${iconSize * 0.35} ${iconSize * 0.15},${iconSize * 0.65} ${iconSize * 0.35},${iconSize * 0.65} ${iconSize * 0.55},${iconSize * 0.85} ${iconSize * 0.55},${iconSize * 0.15} ${iconSize * 0.35},${iconSize * 0.35}"/>
        <path d="M${iconSize * 0.65},${iconSize * 0.35} Q${iconSize * 0.8},${iconSize * 0.5} ${iconSize * 0.65},${iconSize * 0.65}" fill="none" stroke="${color}" stroke-width="${iconSize * 0.06}" stroke-linecap="round"/>
        <path d="M${iconSize * 0.75},${iconSize * 0.25} Q${iconSize * 0.95},${iconSize * 0.5} ${iconSize * 0.75},${iconSize * 0.75}" fill="none" stroke="${color}" stroke-width="${iconSize * 0.06}" stroke-linecap="round"/>
      </g>`;

    default:
      return '';
  }
}

/**
 * Generate badge icon SVG (for notifications)
 * @param {number} size - Icon size in pixels
 * @returns {string} SVG string
 */
export function generateBadgeIconSVG(size = 72) {
  const iconSize = size * 0.7;
  const offset = (size - iconSize) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <g transform="translate(${offset}, ${offset})" fill="${COLORS.red.primary}">
    <polygon points="${iconSize / 2},${iconSize * 0.05} ${iconSize * 0.1},${iconSize * 0.35} ${iconSize * 0.9},${iconSize * 0.35}"/>
    <rect x="${iconSize * 0.18}" y="${iconSize * 0.38}" width="${iconSize * 0.12}" height="${iconSize * 0.45}" rx="${iconSize * 0.02}"/>
    <rect x="${iconSize * 0.44}" y="${iconSize * 0.38}" width="${iconSize * 0.12}" height="${iconSize * 0.45}" rx="${iconSize * 0.02}"/>
    <rect x="${iconSize * 0.70}" y="${iconSize * 0.38}" width="${iconSize * 0.12}" height="${iconSize * 0.45}" rx="${iconSize * 0.02}"/>
    <rect x="${iconSize * 0.08}" y="${iconSize * 0.85}" width="${iconSize * 0.84}" height="${iconSize * 0.1}" rx="${iconSize * 0.02}"/>
  </g>
</svg>`;
}

/**
 * Convert SVG string to data URL
 * @param {string} svg - SVG string
 * @returns {string} Data URL
 */
export function svgToDataUrl(svg) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Generate all icon sizes needed for PWA
 * @returns {Object} Object with icon sizes and their SVG content
 */
export function generateAllIcons() {
  const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 167, 180, 192, 384, 512];
  const icons = {};

  sizes.forEach((size) => {
    icons[`icon-${size}x${size}`] = generateAppIconSVG(size, size >= 192);
  });

  // Maskable icon (with extra padding)
  icons['maskable-icon-512x512'] = generateAppIconSVG(512, true);

  // Badge icon
  icons['badge-72x72'] = generateBadgeIconSVG(72);

  // Shortcut icons
  icons['heritage-shortcut'] = generateShortcutIconSVG('heritage', 96);
  icons['chat-shortcut'] = generateShortcutIconSVG('chat', 96);
  icons['quiz-shortcut'] = generateShortcutIconSVG('quiz', 96);
  icons['audio-shortcut'] = generateShortcutIconSVG('audio', 96);

  return icons;
}

/**
 * Icon sizes configuration for manifest
 */
export const ICON_SIZES = [
  { size: 72, purpose: 'maskable any' },
  { size: 96, purpose: 'maskable any' },
  { size: 128, purpose: 'maskable any' },
  { size: 144, purpose: 'maskable any' },
  { size: 152, purpose: 'maskable any' },
  { size: 192, purpose: 'maskable any' },
  { size: 384, purpose: 'maskable any' },
  { size: 512, purpose: 'maskable any' },
];

export default {
  generateAppIconSVG,
  generateShortcutIconSVG,
  generateBadgeIconSVG,
  svgToDataUrl,
  generateAllIcons,
  ICON_SIZES,
  COLORS,
};
