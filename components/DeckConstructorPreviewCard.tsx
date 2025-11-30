import React, { useEffect, useState, useMemo } from 'react';
import { Pressable, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      <ODCard rank={card.rank} suit={card.suit} photoUri={card.uri} width={50} />
    </View>
  );
}

export function DeckConstructorPreviewCard() {
  const router = useRouter();
  const [draftDeck, setDraftDeck] = useState<DeckMap>(() => createEmptyDeck());
  const maxCards = DECK_KEYS.length;

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(DRAFT_DECK_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as DeckMap;
        setDraftDeck({ ...createEmptyDeck(), ...parsed });
      } catch {
        // ignore parse errors
      }
    })();
  }, []);

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
        <View style={styles.header}>
          <Text style={styles.title}>Open Deck Constructor</Text>
          <Text style={styles.chevron}>›</Text>
        </View>

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
            <Text style={styles.placeholder}>No draft deck yet. Start building your first deck!</Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.progress}>{filledCards.length} / {maxCards} cards selected</Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: tokens.spacing.md,
    gap: tokens.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    marginBottom: tokens.spacing.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#E6E6E6',
    fontSize: 16,
    fontWeight: '700',
  },
  chevron: {
    color: '#E6E6E6',
    fontSize: 20,
    fontWeight: '700',
  },
  previewRow: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xs,
  },
  placeholder: {
    color: '#9CA3AF',
    fontSize: 14,
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.xs,
  },
  miniCardWrapper: {
    marginRight: tokens.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progress: {
    color: '#C8CCD2',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DeckConstructorPreviewCard;
