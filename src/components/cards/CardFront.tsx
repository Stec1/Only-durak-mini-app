import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

type Props = {
  rank?: string;
  suit?: '♠' | '♥' | '♦' | '♣';
  imageUri?: string;
  variant?: 'preview' | 'constructor';
};

export default function CardFront({ rank, suit, imageUri, variant = 'preview' }: Props) {
  const FRAME_W = 6;
  const FRAME_R = 16;

  const isRed = suit === '♥' || suit === '♦';

  return (
    <View style={styles.card}>
      <View style={[styles.frame, { borderWidth: FRAME_W, borderRadius: FRAME_R }]}>
        {(imageUri && imageUri.trim() !== '') ? (
          <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />
        ) : null}

        {rank && suit && (
          <>
            <View style={[styles.badge, styles.badgeTL]}>
              <Text style={styles.rank}>{rank}</Text>
              <Text style={[styles.suit, isRed && styles.red]}>{suit}</Text>
            </View>
            <View style={[styles.badge, styles.badgeBR]}>
              <Text style={[styles.suit, isRed && styles.red]}>{suit}</Text>
              <Text style={styles.rank}>{rank}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    width: '94%', 
    aspectRatio: 0.66, 
    alignSelf: 'center' as const,
  },
  frame: {
    flex: 1,
    borderColor: '#EDEFF2',
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
  },
  photo: { 
    width: '100%', 
    height: '100%',
  },
  badge: {
    position: 'absolute' as const,
    height: 44,
    minWidth: 44,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#0D0E11',
    borderWidth: 2,
    borderColor: '#EDEFF2',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  badgeTL: { 
    top: 10, 
    left: 10,
  },
  badgeBR: { 
    bottom: 10, 
    right: 10,
  },
  rank: { 
    fontSize: 22, 
    fontWeight: '800' as const, 
    color: '#EDEFF2',
  },
  suit: { 
    fontSize: 20, 
    color: '#EDEFF2',
  },
  red: { 
    color: '#FF3B30',
  },
});
