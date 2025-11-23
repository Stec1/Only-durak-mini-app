export type Suit = 'spade' | 'heart' | 'club' | 'diamond';
export type Rank = '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export type CardKey = `${Rank}_${Suit}`;

export interface Deck {
  id: string;
  name: string;
  ownerModelId: string;
  backUri: string;
  cards: Partial<Record<CardKey, string>>;
  createdAt: number;
  updatedAt: number;
}
