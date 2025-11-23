import { Rank, Suit, CardKey } from '@/types/deck';

export const RANKS: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const SUITS: Suit[] = ['spade', 'heart', 'club', 'diamond'];

export const order: CardKey[] = RANKS.flatMap((r) => 
  SUITS.map((s) => `${r}_${s}` as CardKey)
);
