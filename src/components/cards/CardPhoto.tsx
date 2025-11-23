import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CARD_RADIUS, CARD_PADDING } from '../../theme/cards';
import SafeImage from '@/components/SafeImage';

type Props = { 
  uri?: string | null; 
  children?: React.ReactNode;
};

export function CardPhoto({ uri, children }: Props) {
  return (
    <View style={styles.frame}>
      <View style={styles.photoMask}>
        {uri && uri.trim() ? (
          <SafeImage source={{ uri }} fallbackType="nft" style={styles.img} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    borderRadius: CARD_RADIUS - CARD_PADDING,
    position: 'relative' as const,
  },
  photoMask: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: CARD_RADIUS - CARD_PADDING,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  plusIcon: {
    fontSize: 56,
    fontWeight: '400' as const,
    color: '#666666',
  },
});
