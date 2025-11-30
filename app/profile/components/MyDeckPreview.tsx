import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import GlassCard from '@/components/GlassCard';
import Divider from '@/components/Divider';
import { tokens } from '@/src/theme/tokens';
import { useTokens } from '@/src/contexts/theme';
import { Deck } from '@/types/deck';

interface MyDeckPreviewProps {
  decks: Deck[];
  deckProgress: { filled: number; total: number };
  onOpenDeck: (deckId: string) => void;
  onResetDeck: () => void;
}

export default function MyDeckPreview({ decks, deckProgress, onOpenDeck, onResetDeck }: MyDeckPreviewProps) {
  const theme = useTokens();
  const primaryDeck = decks[0];

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: theme.text }]}>My Deck</Text>
      <GlassCard style={styles.card} padding={tokens.spacing.lg}>
        <View style={styles.headerRow}>
          <Text style={[styles.progressText, { color: theme.text }]}>
            {deckProgress.filled} / {deckProgress.total} cards selected
          </Text>
          <TouchableOpacity activeOpacity={0.8} onPress={onResetDeck}>
            <Text style={[styles.reset, { color: theme.accent }]}>Reset</Text>
          </TouchableOpacity>
        </View>
        <Divider style={styles.divider} />

        {primaryDeck ? (
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.preview, { borderColor: theme.border }]}
            onPress={() => onOpenDeck(primaryDeck.id)}
          >
            <ImageBackground
              source={{ uri: primaryDeck.backUri }}
              style={styles.previewImage}
              imageStyle={{ borderRadius: 18 }}
            >
              <View style={styles.previewOverlay} />
              <Text style={styles.deckName}>{primaryDeck.name}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <View style={[styles.empty, { borderColor: theme.border }]}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No decks yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>Create a deck to preview it here.</Text>
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
  },
  reset: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    marginBottom: tokens.spacing.md,
  },
  preview: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    borderColor: 'rgba(0, 228, 255, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  previewImage: {
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  deckName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E5FBFF',
    padding: tokens.spacing.md,
  },
  empty: {
    borderWidth: 1,
    borderRadius: 18,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: tokens.spacing.lg,
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
