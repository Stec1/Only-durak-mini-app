import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { CARD_ASPECT, CARD_RADIUS, suitGlyph, suitColor, cardTemplate, SuitKey } from '@/src/theme/cards';

type Props = {
  imageUri: string;
  rank: string;
  suit: SuitKey;
  width?: number;
};

export default function CardTemplateClassic({ imageUri, rank, suit, width }: Props) {
  return (
    <View style={[styles.wrap, width ? { width } : { width: '90%' }, { aspectRatio: CARD_ASPECT }]}>
      <View style={styles.outerBorder}>
        <View style={styles.face}>
          <View style={styles.innerBorder}>
            <View style={styles.content}>
              <View style={styles.pipTopLeft}>
                <Text style={[styles.rank, { color: suitColor[suit] }]}>{rank}</Text>
                <Text style={[styles.suit, { color: suitColor[suit] }]}>{suitGlyph[suit]}</Text>
              </View>

              {(imageUri && imageUri.trim() !== '') && (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              )}

              <View style={styles.pipBottomRight}>
                <Text style={[styles.rank, { color: suitColor[suit] }]}>{rank}</Text>
                <Text style={[styles.suit, { color: suitColor[suit] }]}>{suitGlyph[suit]}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
  outerBorder: {
    flex: 1,
    backgroundColor: cardTemplate.background,
    borderRadius: CARD_RADIUS,
    padding: cardTemplate.padding,
    borderWidth: cardTemplate.outerBorder.width,
    borderColor: cardTemplate.outerBorder.color,
  },
  face: {
    flex: 1,
    backgroundColor: cardTemplate.faceBg,
    borderRadius: CARD_RADIUS - 6,
    overflow: 'hidden',
  },
  innerBorder: {
    flex: 1,
    borderWidth: cardTemplate.innerBorder.width,
    borderColor: cardTemplate.innerBorder.color,
    borderRadius: cardTemplate.innerBorder.radius,
    margin: 8,
    overflow: 'hidden',
  },
  content: { flex: 1 },
  photo: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  pipTopLeft: {
    position: 'absolute',
    top: 10,
    left: 12,
    alignItems: 'center',
    gap: -2,
  },
  pipBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
    gap: -2,
  },
  rank: { fontSize: 28, fontWeight: '800', letterSpacing: 0.5 },
  suit: { fontSize: 22, fontWeight: '700' },
});
