import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

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

  return (
    <View>
      <Text style={[styles.title, { color: theme.text }]}>Feature Hub</Text>
      <View style={styles.cardsRow}>
        <TouchableOpacity
          style={styles.card}
          onPress={onOpenMarketplace}
          accessibilityRole="button"
        >
          <Image
            source={iconMarketplaceCrate3D}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={onOpenGames}
          accessibilityRole="button"
        >
          <Image
            source={iconGamesGamepad3D}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
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
  cardsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});
