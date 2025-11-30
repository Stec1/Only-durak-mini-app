export type JokerSpotlightItem = {
  id: string;
  name: string;
  rarity: 'Legendary' | 'Epic' | 'Rare';
  price: number;
  tone: 'accent' | 'blue' | 'pink';
};

export type DeckForSale = {
  id: string;
  name: string;
  cardsCount: number;
  price: number;
  creator: string;
  accentKey: 'accent' | 'accentBlue' | 'accentNeon' | 'accentSoft';
};

export const JOKER_SPOTLIGHT: JokerSpotlightItem[] = [
  { id: 'neon-queen', name: 'Neon Queen', rarity: 'Legendary', price: 120, tone: 'accent' },
  { id: 'cosmic-jester', name: 'Cosmic Jester', rarity: 'Epic', price: 95, tone: 'blue' },
  { id: 'crimson-veil', name: 'Crimson Veil', rarity: 'Rare', price: 72, tone: 'pink' },
];

export const MOCK_DECKS: DeckForSale[] = [
  { id: '1', name: 'Cyber Neon Deck', cardsCount: 36, price: 45, creator: '@alice', accentKey: 'accentNeon' },
  { id: '2', name: 'Retro VHS Deck', cardsCount: 36, price: 30, creator: '@neo', accentKey: 'accentBlue' },
  { id: '3', name: 'Aurora Prism Deck', cardsCount: 36, price: 54, creator: '@luna', accentKey: 'accent' },
  { id: '4', name: 'Midnight Alloy Deck', cardsCount: 36, price: 39, creator: '@forge', accentKey: 'accentSoft' },
  { id: '5', name: 'Synthwave Bloom', cardsCount: 36, price: 42, creator: '@violet', accentKey: 'accentNeon' },
  { id: '6', name: 'Glacier Echo Deck', cardsCount: 36, price: 48, creator: '@frost', accentKey: 'accentBlue' },
];
