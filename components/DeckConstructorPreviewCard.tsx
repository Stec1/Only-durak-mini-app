import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { ChevronRight } from 'lucide-react-native';
import { useTokens } from '@/src/contexts/theme';
import { useDraftDeck } from '@/src/state/deckDraftStore';

type Props = {
  onPress: () => void;
};

const MAX_VISIBLE_CARDS = 6;

const suitSymbol: Record<string, string> = {
  spade: '♠',
  heart: '♥',
  club: '♣',
  diamond: '♦',
};

export default function DeckConstructorPreviewCard({ onPress }: Props) {
  const themeTokens = useTokens();
  const { draft, totalSelected, totalSlots } = useDraftDeck();

  const { previewCards, overflow } = useMemo(() => {
    const visible = draft.cards.slice(0, MAX_VISIBLE_CARDS - 1);
    const remaining = draft.cards.length - visible.length;

    if (remaining > 0) {
      return { previewCards: visible, overflow: remaining };
    }

    return { previewCards: draft.cards.slice(0, MAX_VISIBLE_CARDS), overflow: 0 };
  }, [draft.cards]);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <BlurView intensity={25} tint="dark" style={[styles.container, { borderColor: 'rgba(255,255,255,0.14)' }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: themeTokens.text }]}>Open Deck Constructor</Text>
          <ChevronRight color={themeTokens.accent} size={20} strokeWidth={2.5} />
        </View>

        <View style={styles.cardsRow}>
          {draft.cards.length === 0 ? (
            <Text style={[styles.placeholder, { color: themeTokens.subtext }]}>No draft deck yet. Start building your first deck!</Text>
          ) : (
            <View style={styles.cardFan}>
              {previewCards.map((card, index) => (
                <View
                  key={card.id}
                  style={[styles.cardThumb, { marginLeft: index === 0 ? 0 : -14, borderColor: 'rgba(255,255,255,0.18)' }]}
                >
                  {card.imageUrl ? (
                    <Image source={{ uri: card.imageUrl }} style={styles.cardImage} />
                  ) : (
                    <Text style={[styles.cardPlaceholder, { color: themeTokens.text }]}>
                      {card.rank}
                      {suitSymbol[card.suit] ?? ''}
                    </Text>
                  )}
                </View>
              ))}
              {overflow > 0 && (
                <View style={[styles.moreBadge, { marginLeft: previewCards.length ? -14 : 0 }]}>
                  <Text style={styles.moreText}>{`+${overflow}`}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.footerRow}>
          <Text style={[styles.progress, { color: themeTokens.subtext }]}>{`${totalSelected} / ${totalSlots} cards selected`}</Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardsRow: {
    minHeight: 56,
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 13,
    color: '#9BA0AD',
  },
  cardFan: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardThumb: {
    width: 44,
    height: 58,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardPlaceholder: {
    fontWeight: '700',
    fontSize: 14,
  },
  moreBadge: {
    minWidth: 44,
    height: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  moreText: {
    color: '#E6E6E6',
    fontWeight: '700',
    fontSize: 14,
  },
  footerRow: {
    marginTop: 12,
  },
  progress: {
    fontSize: 13,
    color: '#9BA0AD',
  },
});
