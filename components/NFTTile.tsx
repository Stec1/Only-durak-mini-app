import React from 'react';
import { View, Text, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { colors, radius, spacing } from '@/constants/tokens';
import { typography } from '@/constants/typography';
import SafeImage from './SafeImage';

type NFTTileProps = {
  children?: React.ReactNode;
  imageSource?: ImageSourcePropType;
  label?: string;
  isEmpty?: boolean;
  style?: ViewStyle;
};

export default function NFTTile({ children, imageSource, label, isEmpty = false, style }: NFTTileProps) {
  return (
    <View style={[styles.container, isEmpty && styles.empty, style]}>
      <View style={styles.content}>
        {isEmpty ? (
          <>
            <Text style={styles.emptyIcon}>?</Text>
            {label && <Text style={styles.emptyLabel}>{label}</Text>}
          </>
        ) : (
          <>
            {imageSource ? (
              <SafeImage
                source={imageSource}
                fallbackType="nft"
                style={styles.image}
              />
            ) : (
              children
            )}
            {label && <Text style={styles.label}>{label}</Text>}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  empty: {
    opacity: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
    fontFamily: 'Orbitron_800ExtraBold',
    color: colors.textDim,
    opacity: 0.3,
  },
  emptyLabel: {
    ...typography.meta,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  label: {
    ...typography.meta,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
  },
});
