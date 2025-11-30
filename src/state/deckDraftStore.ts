import { useEffect, useState } from 'react';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shallow } from 'zustand/shallow';
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
  actions: {
    setCardImage: (key: CardKey, uri: string | null) => void;
    setDeckName: (name: string) => void;
    setBackUri: (uri: string) => void;
    resetDraft: () => void;
    setDraftFromStorage: (draft: Partial<DraftDeck> & { deck?: DeckMap; deckName?: string }) => void;
  };
};

const blankDeckMap = (): DeckMap => Object.fromEntries(DECK_KEYS.map((k) => [k, null])) as DeckMap;
const DEFAULT_DECK_NAME = 'My Custom Deck';
const STORAGE_KEY = 'DECK_CONSTRUCTOR_DRAFT';

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
    resetDraft: () => set({ deck: blankDeckMap(), deckName: DEFAULT_DECK_NAME, backUri: '' }),
    setDraftFromStorage: (draft) =>
      set({
        deck: draft.deck ?? blankDeckMap(),
        deckName: draft.name ?? draft.deckName ?? DEFAULT_DECK_NAME,
        backUri: draft.backUri ?? '',
      }),
  },
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

export const useDraftDeckActions = () => useDraftDeckStore((state) => state.actions);

type PersistedDraftState = {
  deck: DeckMap;
  deckName: string;
  backUri: string;
};

const loadDraftFromStorage = async (): Promise<PersistedDraftState | null> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as PersistedDraftState) : null;
  } catch (error) {
    console.warn('Failed to load draft deck from storage', error);
    return null;
  }
};

const saveDraftToStorage = async (state: PersistedDraftState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save draft deck to storage', error);
  }
};

export const useDraftDeckPersistence = () => {
  const actions = useDraftDeckActions();
  const draftState = useDraftDeckStore(
    (state) => ({ deck: state.deck, deckName: state.deckName, backUri: state.backUri }),
    shallow
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const stored = await loadDraftFromStorage();
      if (stored && isMounted) {
        actions.setDraftFromStorage(stored);
      }
      if (isMounted) {
        setHydrated(true);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [actions]);

  useEffect(() => {
    if (!hydrated) return;

    saveDraftToStorage({
      deck: draftState.deck,
      deckName: draftState.deckName,
      backUri: draftState.backUri,
    });
  }, [hydrated, draftState.deck, draftState.deckName, draftState.backUri]);
};

export const createEmptyDeck = blankDeckMap;
