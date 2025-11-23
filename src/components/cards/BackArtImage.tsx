import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CARD_RADIUS } from '../../theme/cards';
import SafeImage from '@/components/SafeImage';

type Props = { uri?: string | null };

export function BackArtImage({ uri }: Props) {
  return (
    <View style={styles.mask}>
      {uri && uri.trim() ? (
        <SafeImage source={{ uri }} fallbackType="nft" style={styles.img} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#0f1216',
  },
  img: { 
    width: '100%', 
    height: '100%' 
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#0f1218',
  },
});
