import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

type Suit = 'spade' | 'heart' | 'club' | 'diamond';

export type PlayingCardPremiumProps = {
  rank: string;
  suit: Suit;
  imageUri?: string;
  width?: number;
};

const SUIT_SYMBOLS: Record<Suit, string> = {
  heart: '♥',
  diamond: '♦',
  spade: '♠',
  club: '♣',
};

function getBadgeColors(suit: Suit) {
  const isRed = suit === 'heart' || suit === 'diamond';
  return {
    badgeBg: isRed ? '#FFFFFF' : '#0C0E11',
    badgeBorder: isRed ? '#FFFFFF' : '#E6E7EB',
    rankColor: isRed ? '#000000' : '#FFFFFF',
    suitColor: isRed ? '#E53935' : '#FFFFFF',
  };
}

export default function PlayingCardPremium({ rank, suit, imageUri, width = 320 }: PlayingCardPremiumProps) {
  const height = Math.round(width * 7 / 5);
  const isWideRank = rank.length > 1;
  const colors = getBadgeColors(suit);

  return (
    <View style={[styles.card, { width, height }]}>
      <View style={styles.frame}>
        {(imageUri && imageUri.trim() !== '') ? (
          <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />
        ) : null}

        {/* Temporarily hidden rank/suit badges */}
        {/* <View style={[styles.cornerTopLeft, isWideRank && styles.cornerWide, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
          <Text style={[styles.rank, { color: colors.rankColor }]}>{rank}</Text>
          <Text style={[styles.suit, { color: colors.suitColor }]}>{SUIT_SYMBOLS[suit]}</Text>
        </View>

        <View style={[styles.cornerBottomRight, isWideRank && styles.cornerWide, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
          <Text style={[styles.suit, { color: colors.suitColor }]}>{SUIT_SYMBOLS[suit]}</Text>
          <Text style={[styles.rank, { color: colors.rankColor }]}>{rank}</Text>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  frame: {
    flex: 1,
    borderWidth: 6,
    borderColor: '#EDEFF2',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 3,
    left: 3,
    borderWidth: 2,
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    minHeight: 44,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    borderWidth: 2,
    borderBottomRightRadius: 14,
    borderTopLeftRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    minHeight: 44,
  },
  cornerWide: {
    paddingHorizontal: 10,
  },
  rank: {
    fontSize: 28,
    fontWeight: '800',
    marginHorizontal: 2,
    minWidth: 22,
    textAlign: 'center',
  },
  suit: {
    fontSize: 22,
    fontWeight: '800',
    marginHorizontal: 2,
  },
});
