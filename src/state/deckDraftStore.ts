import { create } from 'zustand';
import { DECK_KEYS, type CardKey, type DeckMap, type Rank, type Suit } from '@/utils/deck';

export type DraftDeckCard = {
  id: CardKey;
  rank: Rank;
  suit: Suit;
  imageUrl?: string;
};

export type DraftDeck = {
  cards: DraftDeckCard[];
  backUri?: string;
  name?: string;
};

type DraftDeckState = {
  deck: DeckMap;
  deckName: string;
  backUri: string;
  setCardImage: (key: CardKey, uri: string | null) => void;
  setDeckName: (name: string) => void;
  setBackUri: (uri: string) => void;
  resetDraft: () => void;
  setDraftFromStorage: (draft: Partial<DraftDeck> & { deck?: DeckMap; deckName?: string }) => void;
};

const blankDeckMap = (): DeckMap => Object.fromEntries(DECK_KEYS.map((k) => [k, null])) as DeckMap;
const DEFAULT_DECK_NAME = 'My Custom Deck';

const buildCardsFromDeck = (deck: DeckMap): DraftDeckCard[] =>
  DECK_KEYS.reduce<DraftDeckCard[]>((acc, key) => {
    const uri = deck[key];
    if (!uri) return acc;

    const [rank, suit] = key.split('_') as [Rank, Suit];
    return acc.concat({ id: key, rank, suit, imageUrl: uri });
  }, []);

export const useDraftDeckStore = create<DraftDeckState>()((set) => ({
  deck: blankDeckMap(),
  deckName: DEFAULT_DECK_NAME,
  backUri: '',
  setCardImage: (key, uri) =>
    set((state) => ({
      deck: {
        ...state.deck,
        [key]: uri,
      },
    })),
  setDeckName: (name) => set({ deckName: name }),
  setBackUri: (uri) => set({ backUri: uri }),
  resetDraft: () => set({ deck: blankDeckMap(), deckName: DEFAULT_DECK_NAME, backUri: '' }),
  setDraftFromStorage: (draft) =>
    set({
      deck: draft.deck ?? blankDeckMap(),
      deckName: draft.name ?? draft.deckName ?? DEFAULT_DECK_NAME,
      backUri: draft.backUri ?? '',
    }),
}));

export const useDraftDeck = () =>
  useDraftDeckStore((state) => {
    const cards = buildCardsFromDeck(state.deck);

    return {
      draft: {
        cards,
        backUri: state.backUri || undefined,
        name: state.deckName || undefined,
      },
      totalSelected: cards.length,
      totalSlots: DECK_KEYS.length,
    };
  });

export const useDraftDeckActions = () =>
  useDraftDeckStore((state) => ({
    setCardImage: state.setCardImage,
    setDeckName: state.setDeckName,
    setBackUri: state.setBackUri,
    resetDraft: state.resetDraft,
    setDraftFromStorage: state.setDraftFromStorage,
  }));

// DEBUG NOTE:
// The previous AsyncStorage persistence layer was still surfacing "Maximum update depth exceeded"
// warnings in dev after the recent merges, likely because the store subscription immediately
// re-triggered React updates while hydration was running in multiple screens. To stop the critical
// errors and allow the UI to boot, persistence is temporarily disabled and kept behind no-op
// helpers until it can be reintroduced safely.
export const loadDraftDeckFromStorage = async () => {
  return;
};

export const ensureDraftDeckPersistence = () => () => {};

export const createEmptyDeck = blankDeckMap;
