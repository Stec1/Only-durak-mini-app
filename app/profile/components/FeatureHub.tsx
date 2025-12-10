import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';

import iconGamesGamepad3D from '../../../assets/images/icon_games_gamepad_3d.png';
import iconMarketplaceCrate3D from '../../../assets/images/icon_marketplace_crate_3d.png';

interface FeatureHubProps {
  onOpenMarketplace: () => void;
  onOpenGames: () => void;
}

export default function FeatureHub({
  onOpenMarketplace,
  onOpenGames,
}: FeatureHubProps) {
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
            activeOpacity={0.9}
            onPress={card.onPress}
            style={[
              styles.cardBase,
              {
                backgroundColor: isDark ? theme.surfaceElevated : theme.surface,
                borderColor: theme.accentSoft,
                shadowColor: theme.cardShadow.shadowColor,
                shadowOpacity: theme.cardShadow.shadowOpacity,
                shadowRadius: theme.cardShadow.shadowRadius,
                shadowOffset: theme.cardShadow.shadowOffset,
                elevation: theme.cardShadow.elevation,
              },
            ]}
          >
            <Image
              source={card.image}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: tokens.fontFamily.heading,
    fontSize: tokens.fontSize.lg,
    lineHeight: tokens.lineHeight.lg,
    marginBottom: tokens.spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  cardBase: {
    flex: 1,
    minHeight: 152,
    borderRadius: tokens.borderRadius['2xl'],
    borderWidth: 1,
    overflow: 'hidden',
    // Web-only blur / glass can be re-added later if needed
    ...(Platform.OS === 'web'
      ? { backdropFilter: 'blur(22px)' as any }
      : null),
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});
