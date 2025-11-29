import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  hydrated: boolean;
  actions: {
    setCardImage: (key: CardKey, uri: string | null) => void;
    setDeckName: (name: string) => void;
    setBackUri: (uri: string) => void;
    resetDraft: () => void;
    setHydrated: (value: boolean) => void;
  };
};

const blankDeckMap = (): DeckMap => Object.fromEntries(DECK_KEYS.map((k) => [k, null])) as DeckMap;

const buildCardsFromDeck = (deck: DeckMap): DraftDeckCard[] =>
  DECK_KEYS.reduce<DraftDeckCard[]>((acc, key) => {
    const uri = deck[key];
    if (!uri) return acc;

    const [rank, suit] = key.split('_') as [Rank, Suit];
    return acc.concat({ id: key, rank, suit, imageUrl: uri });
  }, []);

export const useDraftDeckStore = create<DraftDeckState>()(
  persist(
    (set) => ({
      deck: blankDeckMap(),
      deckName: 'My Custom Deck',
      backUri: '',
      hydrated: false,
      actions: {
        setCardImage: (key, uri) =>
          set((state) => ({
            deck: {
              ...state.deck,
              [key]: uri,
            },
          })),
        setDeckName: (name) => set({ deckName: name }),
        setBackUri: (uri) => set({ backUri: uri }),
        resetDraft: () => set({ deck: blankDeckMap(), deckName: 'My Custom Deck', backUri: '' }),
        setHydrated: (value) => set({ hydrated: value }),
      },
    }),
    {
      name: 'DECK_CONSTRUCTOR_DRAFT',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ deck: state.deck, deckName: state.deckName, backUri: state.backUri }),
      onRehydrateStorage: () => (state) => {
        state?.actions.setHydrated(true);
      },
    }
  )
);

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

export const useDraftDeckActions = () => useDraftDeckStore((state) => state.actions);

export const createEmptyDeck = blankDeckMap;
