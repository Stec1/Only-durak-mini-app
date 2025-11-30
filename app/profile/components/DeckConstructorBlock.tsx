import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import GlassCard from '@/components/GlassCard';
import { tokens } from '@/src/theme/tokens';
import { useTokens } from '@/src/contexts/theme';
import { DeckMap } from '@/utils/deck';

interface DeckConstructorBlockProps {
  deckMap: DeckMap | null;
  totalSlots: number;
  onOpenConstructor: () => void;
}

export default function DeckConstructorBlock({ deckMap, totalSlots, onOpenConstructor }: DeckConstructorBlockProps) {
  const theme = useTokens();

  const filledUris = useMemo(() => {
    if (!deckMap) return [] as string[];
    return Object.values(deckMap).filter((uri): uri is string => Boolean(uri)).slice(0, 7);
  }, [deckMap]);

  const filledCount = useMemo(() => (deckMap ? Object.values(deckMap).filter(Boolean).length : 0), [deckMap]);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: theme.text }]}>Deck Constructor</Text>
      <GlassCard style={styles.card} padding={tokens.spacing.lg}>
        <View style={styles.headerRow}>
          <Text style={[styles.progress, { color: theme.text }]}>
            {filledCount} / {totalSlots} cards selected
          </Text>
          <TouchableOpacity style={[styles.cta, { borderColor: theme.border }]} onPress={onOpenConstructor} activeOpacity={0.85}>
            <Text style={[styles.ctaLabel, { color: theme.accent }]}>Open Builder</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.miniRow}>
          {filledUris.length > 0 ? (
            filledUris.map((uri, idx) => (
              <View key={uri + idx} style={[styles.miniCard, { borderColor: theme.border }]}>
                <Image source={{ uri }} style={styles.miniImage} />
              </View>
            ))
          ) : (
            <View style={[styles.placeholder, { borderColor: theme.border }]}>
              <Text style={[styles.placeholderText, { color: theme.subtext }]}>Add cards to see them here.</Text>
            </View>
          )}
        </ScrollView>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: tokens.spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.25)',
    // @ts-expect-error web-only blur support
    backdropFilter: 'blur(22px)',
    shadowColor: '#3CF2FF',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.md,
  },
  progress: {
    fontSize: 14,
    fontWeight: '700',
  },
  cta: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 228, 255, 0.08)',
  },
  ctaLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  miniRow: {
    gap: tokens.spacing.sm,
  },
  miniCard: {
    width: 70,
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  miniImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  placeholderText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
