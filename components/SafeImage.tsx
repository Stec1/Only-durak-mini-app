import React from 'react';
import { Image, ImageProps, ImageSourcePropType, View, StyleSheet } from 'react-native';
import { User, Package } from 'lucide-react-native';
import { colors } from '@/constants/tokens';

/**
 * SafeImage component prevents "source.uri should not be an empty string" warnings.
 * 
 * Automatically shows a fallback icon when:
 * - source is undefined/null
 * - source.uri is empty string
 * 
 * Usage:
 * <SafeImage source={{ uri: someUrl }} fallbackType="avatar" style={styles.image} />
 * <SafeImage source={{ uri: someUrl }} fallbackType="nft" style={styles.nftImage} />
 */

type SafeImageProps = ImageProps & {
  fallbackType?: 'avatar' | 'nft';
};

export default function SafeImage(props: SafeImageProps) {
  const { source, fallbackType = 'avatar', style, ...rest } = props;
  
  const showFallback = !source || 
    (typeof source === 'object' && 
     'uri' in source && 
     (!source.uri || source.uri === ''));

  if (showFallback) {
    const iconSize = 32;
    const iconColor = colors.textDim;
    
    return (
      <View style={[styles.fallbackContainer, style]}>
        {fallbackType === 'avatar' ? (
          <User color={iconColor} size={iconSize} strokeWidth={2} />
        ) : (
          <Package color={iconColor} size={iconSize} strokeWidth={2} />
        )}
      </View>
    );
  }

  return <Image source={source as ImageSourcePropType} style={style} {...rest} />;
}

const styles = StyleSheet.create({
  fallbackContainer: {
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
