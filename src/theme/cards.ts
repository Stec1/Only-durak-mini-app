// Card Dimensions
export const CARD_ASPECT = 5 / 7;
export const CARD_RADIUS = 18;

// Suit Definitions
export const SUIT = { spade: 'spade', heart: 'heart', club: 'club', diamond: 'diamond' } as const;
export type SuitKey = keyof typeof SUIT;

export const suitGlyph: Record<SuitKey, string> = {
  spade: '♠',
  heart: '♥',
  club: '♣',
  diamond: '♦',
};

export const suitColor: Record<SuitKey, string> = {
  spade: '#0C0D10',
  club: '#0C0D10',
  heart: '#FF4B57',
  diamond: '#FF4B57',
};

// Classic Black Template Theme
export const cardTemplate = {
  outerBorder: { color: '#ECEFF3', width: 8 },
  innerBorder: { color: '#ECEFF3', width: 4, radius: 12 },
  background: '#0C0D10',
  faceBg: '#0C0D10',
  padding: 14,
  pipFont: { family: undefined, weight: '700' as const },
  rankFont: { family: undefined, weight: '800' as const },
};
