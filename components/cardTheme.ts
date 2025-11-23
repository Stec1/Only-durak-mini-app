export const CARD_ASPECT = 5 / 7; // width / height (portrait)
export const CARD_RADIUS = 24; // uniform corner radius
export const PIP_SIZE = 16; // suit icon size
export const INDEX_FONT = 18; // rank font size

export const EDGE_OPACITY = 0.9;
export const EDGE_INNER = 'rgba(255,255,255,0.06)';

export const cardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.35,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 6 },
  elevation: 8,
};

export const faceTexture = {
  backgroundColor: '#0f1218',
  borderTopColor: 'rgba(255,255,255,0.03)',
  borderBottomColor: 'rgba(0,0,0,0.25)',
  borderLeftColor: 'rgba(255,255,255,0.02)',
  borderRightColor: 'rgba(0,0,0,0.18)',
};

export const SuitPalette = {
  spade: { edge: '#3EE7E7', pip: '#73F3F3' },
  heart: { edge: '#FF6B8B', pip: '#FF8EA6' },
  club: { edge: '#35E06C', pip: '#73F6A0' },
  diamond: { edge: '#9D72FF', pip: '#C3A6FF' },
};

export type SuitKey = keyof typeof SuitPalette;
