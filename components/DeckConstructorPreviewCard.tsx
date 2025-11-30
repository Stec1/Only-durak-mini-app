import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Pressable, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ODCard from '@/components/ODCard';
import GlassCard from '@/components/GlassCard';
import { DECK_KEYS, type CardKey, type DeckMap, type Rank, type Suit } from '@/utils/deck';
import { tokens } from '@/src/theme/tokens';

const DRAFT_DECK_KEY = 'DECK_CONSTRUCTOR_DRAFT_V1';

const createEmptyDeck = (): DeckMap => Object.fromEntries(DECK_KEYS.map(k => [k, null])) as DeckMap;

function parseCardKey(key: CardKey): { rank: Rank; suit: Suit } {
  const [rank, suit] = key.split('_') as [Rank, Suit];
  return { rank, suit };
}

type DraftPreviewCard = { key: CardKey; rank: Rank; suit: Suit; uri: string };

function MiniDeckCard({ card }: { card: DraftPreviewCard }) {
  return (
    <View style={styles.miniCardWrapper}>
      <ODCard rank={card.rank} suit={card.suit} photoUri={card.uri} width={64} />
    </View>
  );
}

export function DeckConstructorPreviewCard() {
  const router = useRouter();
  const [draftDeck, setDraftDeck] = useState<DeckMap>(() => createEmptyDeck());
  const maxCards = DECK_KEYS.length;

  const readDraft = useCallback(async () => {
    const raw = await AsyncStorage.getItem(DRAFT_DECK_KEY);
    if (!raw) {
      setDraftDeck(createEmptyDeck());
      return;
    }
    try {
      const parsed = JSON.parse(raw) as DeckMap;
      setDraftDeck({ ...createEmptyDeck(), ...parsed });
    } catch {
      setDraftDeck(createEmptyDeck());
    }
  }, []);

  useEffect(() => {
    readDraft();
  }, [readDraft]);

  useFocusEffect(
    useCallback(() => {
      readDraft();
    }, [readDraft])
  );

  const filledCards = useMemo(() => (
    Object.entries(draftDeck)
      .filter(([, uri]) => !!uri)
      .map(([key, uri]) => ({ ...parseCardKey(key as CardKey), key: key as CardKey, uri: uri as string }))
  ), [draftDeck]);

  const handlePress = () => {
    router.push('/deck-constructor');
  };

  return (
    <Pressable onPress={handlePress} style={{ width: '100%' }}>
      <GlassCard style={styles.card}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.previewRow}
        >
          {filledCards.length > 0 ? (
            filledCards.map((card) => (
              <MiniDeckCard key={card.key} card={card} />
            ))
          ) : (
            Array.from({ length: 6 }).map((_, idx) => (
              <View key={idx} style={styles.placeholderCard}>
                <Text style={styles.placeholderPlus}>＋</Text>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.progress}>{filledCards.length} / {maxCards} cards selected</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    marginBottom: tokens.spacing.sm,
    overflow: 'hidden',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  previewRow: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xs,
    gap: tokens.spacing.xs,
  },
  placeholderCard: {
    width: 64,
    height: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderPlus: {
    color: '#9CA3AF',
    fontSize: 22,
    fontWeight: '700',
  },
  miniCardWrapper: {
    marginRight: tokens.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: tokens.spacing.xs,
  },
  progress: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '700',
  },
  chevron: {
    color: '#E6E6E6',
    fontSize: 18,
    fontWeight: '800',
  },
});

export default DeckConstructorPreviewCard;
