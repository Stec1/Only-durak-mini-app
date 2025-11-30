import React, { useMemo } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Settings } from 'lucide-react-native';

import { tokens } from '@/src/theme/tokens';
import { useTokens } from '@/src/contexts/theme';
import { Deck } from '@/types/deck';

interface MyDeckPreviewProps {
  decks: Deck[];
  deckProgress: { filled: number; total: number };
  onOpenDeck: (deckId: string) => void;
  onOpenDeckSettings?: (deckId: string) => void;
  onResetDeck: () => void;
}
const applyAlpha = (color: string, alpha: number) => {
  if (color.startsWith('#')) {
    const normalized = color.replace('#', '');
    const bigint = parseInt(normalized.length === 3 ? normalized.repeat(2) : normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (color.startsWith('rgb')) {
    const parts = color
      .replace(/rgba?\(/, '')
      .replace(')', '')
      .split(',')
      .map((part) => Number(part.trim()))
      .slice(0, 3);
    const [r, g, b] = parts;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
};

export default function MyDeckPreview({ decks, deckProgress, onOpenDeck, onOpenDeckSettings, onResetDeck }: MyDeckPreviewProps) {
  const theme = useTokens();
  const hasDecks = decks.length > 0;
  const deckSettingsHandler = useMemo(() => onOpenDeckSettings || onOpenDeck, [onOpenDeck, onOpenDeckSettings]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>My Deck</Text>
          <Text style={[styles.progressText, { color: theme.subtext }]}>
            {deckProgress.filled} / {deckProgress.total} cards selected
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.85} onPress={onResetDeck}>
          <Text style={[styles.reset, { color: theme.accent }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {hasDecks ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.deckList}
        >
          {decks.map((deck) => (
            <View
              key={deck.id}
              style={[styles.deckCard, { backgroundColor: applyAlpha(theme.cardBg, 0.9), borderColor: theme.border }]}
            >
              <TouchableOpacity activeOpacity={0.85} onPress={() => onOpenDeck(deck.id)}>
                <ImageBackground
                  source={{ uri: deck.backUri }}
                  style={styles.deckImage}
                  imageStyle={styles.deckImageRadius}
                >
                  <View style={[styles.deckOverlay, { backgroundColor: applyAlpha(theme.bg, 0.35) }]} />
                  <Text style={[styles.deckName, { color: theme.text }]}>{deck.name}</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deckSettings, { backgroundColor: applyAlpha(theme.border, 0.6) }]}
                hitSlop={8}
                onPress={() => deckSettingsHandler(deck.id)}
              >
                <Settings size={18} color={theme.text} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.empty, { borderColor: theme.border, backgroundColor: applyAlpha(theme.cardBg, 0.9) }]}> 
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No decks yet</Text>
          <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>Create a deck to preview it here.</Text>
        </View>
      )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
  },
  reset: {
    fontSize: 14,
    fontWeight: '700',
  },
  deckList: {
    paddingVertical: tokens.spacing.sm,
    paddingRight: tokens.spacing.xs,
    paddingLeft: tokens.spacing.xs,
  },
  deckCard: {
    width: 180,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: tokens.spacing.md,
  },
  deckImage: {
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  deckImageRadius: {
    borderRadius: 18,
  },
  deckOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  deckName: {
    fontSize: 16,
    fontWeight: '800',
    padding: tokens.spacing.md,
  },
  deckSettings: {
    position: 'absolute',
    top: tokens.spacing.sm,
    right: tokens.spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  empty: {
    borderWidth: 1,
    borderRadius: 18,
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
