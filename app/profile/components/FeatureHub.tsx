import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
      <Text
        style={[
          styles.title,
          { color: isDark ? theme.textPrimary : theme.textPrimary },
        ]}
      >
        Feature Hub
      </Text>

      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.key}
            activeOpacity={0.9}
            onPress={card.onPress}
            style={[
              styles.cardBase,
              {
                backgroundColor: isDark
                  ? theme.surfaceElevated
                  : theme.surface,
                borderColor: theme.accentSoft,
              },
            ]}
          >
            <View style={styles.cardGlass}>
              <Image
                source={card.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>
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
    padding: tokens.spacing.lg,
    borderRadius: tokens.borderRadius['2xl'],
    borderWidth: 1,
  },
  cardGlass: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: tokens.borderRadius['2xl'],
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
  cardImage: {
    width: '100%',
    height: '100%',
  },
});
