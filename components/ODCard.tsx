import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CARD_ASPECT, CARD_RADIUS, CARD_PADDING } from '@/src/theme/cards';
import { CardPhoto } from '@/src/components/cards/CardPhoto';

const SuitPalette = {
  spade: { edge: '#FFFFFF', pip: '#000000', rank: '#000000' },
  heart: { edge: '#FFFFFF', pip: '#FF3B30', rank: '#000000' },
  club: { edge: '#FFFFFF', pip: '#000000', rank: '#000000' },
  diamond: { edge: '#FFFFFF', pip: '#FF3B30', rank: '#000000' },
};

type SuitKey = keyof typeof SuitPalette;

type Props = {
  rank: string; // '6','7',...,'10','J','Q','K','A'
  suit: SuitKey; // 'spade'|'heart'|'club'|'diamond'
  width?: number; // optional width, else stretches via parent
  photoUri?: string | null; // optional user photo for the face
};

function ODCard({ rank, suit, width, photoUri }: Props) {
  const palette = SuitPalette[suit];
  return (
    <View style={[styles.cardOuter, { width }]}>
      <View style={[styles.cardInner, { borderColor: palette.edge }]}>
        <CardPhoto uri={photoUri}>
          <View style={styles.tl}>
            <Text style={[styles.rank, { color: palette.rank }]}>{rank}</Text>
            <Text style={[styles.pip, { color: palette.pip }]}>{suitToGlyph(suit)}</Text>
          </View>
        </CardPhoto>
      </View>
    </View>
  );
}

function suitToGlyph(s: SuitKey) {
  switch (s) {
    case 'spade': return '♠';
    case 'heart': return '♥';
    case 'club': return '♣';
    case 'diamond': return '♦';
  }
}

export default React.memo(ODCard, (prev, next) =>
  prev.photoUri === next.photoUri &&
  prev.rank === next.rank &&
  prev.suit === next.suit &&
  prev.width === next.width
);

const styles = StyleSheet.create({
  cardOuter: {
    aspectRatio: CARD_ASPECT,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#0A0A0A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInner: {
    flex: 1,
    margin: CARD_PADDING,
    borderRadius: CARD_RADIUS - CARD_PADDING,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative' as const,
  },
  tl: {
    position: 'absolute' as const,
    top: 8,
    left: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
    zIndex: 10,
  },
  rank: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 22,
    letterSpacing: -0.5,
  },
  pip: {
    fontSize: 18,
    lineHeight: 20,
  },

});
