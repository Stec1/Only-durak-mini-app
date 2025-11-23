import AsyncStorage from '@react-native-async-storage/async-storage';
import { Deck } from '@/types/deck';

const listKey = (modelId: string) => `@od:${modelId}:decks:list`;
const deckKey = (modelId: string, deckId: string) => `@od:${modelId}:decks:${deckId}`;

export async function getDecks(modelId: string): Promise<Deck[]> {
  try {
    const ids = JSON.parse((await AsyncStorage.getItem(listKey(modelId))) || '[]') as string[];
    const decks = await Promise.all(
      ids.map(async (id) => {
        const data = await AsyncStorage.getItem(deckKey(modelId, id));
        return data ? JSON.parse(data) as Deck : null;
      })
    );
    return decks.filter((d): d is Deck => d !== null);
  } catch (err) {
    console.error('getDecks error:', err);
    return [];
  }
}

export async function getDeck(modelId: string, deckId: string): Promise<Deck | null> {
  try {
    const data = await AsyncStorage.getItem(deckKey(modelId, deckId));
    return data ? JSON.parse(data) as Deck : null;
  } catch (err) {
    console.error('getDeck error:', err);
    return null;
  }
}

export async function saveDeck(modelId: string, deck: Deck) {
  try {
    const ids = JSON.parse((await AsyncStorage.getItem(listKey(modelId))) || '[]') as string[];
    if (!ids.includes(deck.id)) {
      ids.push(deck.id);
      await AsyncStorage.setItem(listKey(modelId), JSON.stringify(ids));
    }
    deck.updatedAt = Date.now();
    await AsyncStorage.setItem(deckKey(modelId, deck.id), JSON.stringify(deck));
  } catch (err) {
    console.error('saveDeck error:', err);
    throw err;
  }
}

export async function deleteDeck(modelId: string, deckId: string) {
  try {
    const ids = JSON.parse((await AsyncStorage.getItem(listKey(modelId))) || '[]') as string[];
    const next = ids.filter((id) => id !== deckId);
    await AsyncStorage.setItem(listKey(modelId), JSON.stringify(next));
    await AsyncStorage.removeItem(deckKey(modelId, deckId));
  } catch (err) {
    console.error('deleteDeck error:', err);
    throw err;
  }
}
