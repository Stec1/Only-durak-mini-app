import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { CARD_COLORS, CARD_RATIO, RADIUS, STROKE, INSET, CORNER } from '@/src/constants/cardTheme';

type SuitKey = 'spade' | 'heart' | 'club' | 'diamond';

type Props = {
  imageUri?: string;
  rank: string;
  suit: SuitKey;
  width?: number;
  style?: ViewStyle;
};

const suitGlyph: Record<SuitKey, string> = {
  spade: '♠',
  heart: '♥',
  club: '♣',
  diamond: '♦',
};

export default function PlayingCardFrame({ imageUri, rank, suit, width = 280, style }: Props) {
  const cardWidth = width;
  const cardHeight = cardWidth * CARD_RATIO;
  const badgeW = Math.round(cardWidth * CORNER.badgeScale + (rank?.length === 2 ? 10 : 0));
  const badgeH = Math.round(badgeW * 0.72);
  
  const isRed = suit === 'heart' || suit === 'diamond';
  const badgeBg = isRed ? '#FFFFFF' : '#0C0E11';
  const badgeBorder = isRed ? '#FFFFFF' : '#E6E7EB';
  const rankColor = isRed ? '#000000' : '#FFFFFF';
  const suitColor = isRed ? '#E53935' : '#FFFFFF';

  return (
    <View style={[styles.container, { width: cardWidth, height: cardHeight }, style]}>
      <View style={styles.outerFrame}>
        <View style={styles.innerPhotoFrame}>
          <View style={styles.photoContainer}>
            {(imageUri && imageUri.trim() !== '') && (
              <Image
                source={{ uri: imageUri }}
                style={styles.photo}
                resizeMode="cover"
              />
            )}
          </View>
        </View>

        <View style={[styles.badge, styles.badgeTopLeft, { width: badgeW, height: badgeH, backgroundColor: badgeBg, borderColor: badgeBorder }]}>
          <Text style={[styles.rankText, { color: rankColor, fontSize: badgeH * 0.8, lineHeight: badgeH * 0.9 }]}>
            {rank}
          </Text>
          <Text style={[styles.suitText, { color: suitColor, fontSize: badgeH * 0.7, lineHeight: badgeH * 0.8 }]}>
            {suitGlyph[suit]}
          </Text>
        </View>

        <View style={[styles.badge, styles.badgeBottomRight, { width: badgeW, height: badgeH, backgroundColor: badgeBg, borderColor: badgeBorder }]}>
          <Text style={[styles.rankText, { color: rankColor, fontSize: badgeH * 0.8, lineHeight: badgeH * 0.9 }]}>
            {rank}
          </Text>
          <Text style={[styles.suitText, { color: suitColor, fontSize: badgeH * 0.7, lineHeight: badgeH * 0.8 }]}>
            {suitGlyph[suit]}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  outerFrame: {
    flex: 1,
    backgroundColor: CARD_COLORS.outerBg,
    borderRadius: RADIUS.outer,
    borderWidth: STROKE.outer,
    borderColor: CARD_COLORS.outerStroke,
    shadowColor: CARD_COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  innerPhotoFrame: {
    position: 'absolute',
    top: INSET.outerToInner,
    left: INSET.outerToInner,
    right: INSET.outerToInner,
    bottom: INSET.outerToInner,
    borderRadius: RADIUS.inner,
    borderWidth: STROKE.inner,
    borderColor: CARD_COLORS.innerStroke,
    overflow: 'hidden',
  },
  photoContainer: {
    flex: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    borderRadius: RADIUS.notch,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 4,
    shadowColor: CARD_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeTopLeft: {
    top: 2,
    left: 2,
  },
  badgeBottomRight: {
    bottom: 2,
    right: 2,
    transform: [{ rotate: '180deg' }],
  },
  rankText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  suitText: {
    fontWeight: '700',
  },
});
