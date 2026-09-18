// Deterministic "avatar" generation: initials + a colour picked from the
// student's name, so every record gets a consistent, distinct badge without
// needing any external image.

const PALETTE = [
  { bg: '#7a2e2e', fg: '#f6e9e6' }, // maroon
  { bg: '#2f5f8a', fg: '#e8f0f7' }, // steel blue
  { bg: '#52664f', fg: '#e9f0e7' }, // sage
  { bg: '#8a6d2f', fg: '#f7f0e2' }, // ochre
  { bg: '#5b4b8a', fg: '#eee9f7' }, // plum
  { bg: '#2f7a72', fg: '#e5f4f1' }, // teal
  { bg: '#8a3f5b', fg: '#f7e6ec' }, // rose
  { bg: '#3f5b8a', fg: '#e6ecf7' }, // indigo
];

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function colorFor(name: string): { bg: string; fg: string } {
  return PALETTE[hashString(name) % PALETTE.length];
}
