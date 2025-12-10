import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';
import iconMarketplaceCrate3D from '../../../assets/images/icon_marketplace_crate_3d.png';
import iconGamesGamepad3D from '../../../assets/images/icon_games_gamepad_3d.png';

interface FeatureHubProps {
  onOpenMarketplace: () => void;
  onOpenGames: () => void;
}

export default function FeatureHub({ onOpenMarketplace, onOpenGames }: FeatureHubProps) {
  const theme = useTokens();
  const isDark = theme.isDark;
  const cards = [
    {
      key: 'marketplace',
      image: iconMarketplaceCrate3D,
      onPress: onOpenMarketplace,
    },
    {
      key: 'games',
      image: iconGamesGamepad3D,
      onPress: onOpenGames,
    },
  ];

  return (
    <View>
      <Text style={[styles.title, { color: theme.text }]}>Feature Hub</Text>
      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.key}
            activeOpacity={0.8}
            style={[
              styles.cardBase,
              isDark
                ? styles.cardGlass
                : {
                    backgroundColor: theme.surfaceElevated,
                    borderWidth: 1,
                    borderColor: theme.borderSubtle,
                    shadowColor: theme.cardShadow.shadowColor,
                    shadowOpacity: theme.cardShadow.shadowOpacity,
                    shadowRadius: theme.cardShadow.shadowRadius,
                    shadowOffset: theme.cardShadow.shadowOffset,
                    elevation: theme.cardShadow.elevation,
                  },
            ]}
            onPress={card.onPress}
          >
            <Image source={card.image} style={styles.featureImage} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: tokens.spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  cardBase: {
    flex: 1,
    minHeight: 152,
    borderRadius: tokens.borderRadius['2xl'],
    overflow: 'hidden',
  },
  cardGlass: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    // @ts-expect-error web-only blur support
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(22px)' } : null),
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.25)',
    shadowColor: '#3CF2FF',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  featureImage: {
    width: '100%',
    height: '100%',
    borderRadius: tokens.borderRadius['2xl'],
  },
});
