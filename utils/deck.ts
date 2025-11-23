import AsyncStorage from '@react-native-async-storage/async-storage';

export const SUITS = ['spade','heart','club','diamond'] as const;
export type Suit = typeof SUITS[number];

export const RANKS = ['6','7','8','9','10','J','Q','K','A'] as const;
export type Rank = typeof RANKS[number];

export type CardKey = `${Rank}_${Suit}`;

export const cardKey = (rank: Rank, suit: Suit): CardKey => `${rank}_${suit}`;

export const DECK_KEYS: CardKey[] = RANKS.flatMap(r =>
  SUITS.map(s => cardKey(r as Rank, s as Suit))
) as CardKey[];

const STORAGE_KEY = 'onlydurak.deck.v1';

export type DeckMap = Record<CardKey, string | null>;

export async function loadDeck(): Promise<DeckMap> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return Object.fromEntries(DECK_KEYS.map(k => [k, null])) as DeckMap;
    const parsed = JSON.parse(raw);
    const blank: DeckMap = Object.fromEntries(DECK_KEYS.map(k => [k, null])) as DeckMap;
    return { ...blank, ...parsed };
  } catch {
    return Object.fromEntries(DECK_KEYS.map(k => [k, null])) as DeckMap;
  }
}

export async function saveDeck(deck: DeckMap) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
}
