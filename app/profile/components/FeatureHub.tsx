import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';

import iconGamesGamepad3D from '../../../assets/images/icon_games_gamepad_3d.png';
import iconMarketplaceCrate3D from '../../../assets/images/icon_marketplace_crate_3d.png';

interface FeatureHubProps {
  onOpenMarketplace: () => void;
  onOpenGames: () => void;
}

const FeatureHub: React.FC<FeatureHubProps> = ({
  onOpenMarketplace,
  onOpenGames,
}) => {
  const theme = useTokens();
  const isDark = theme.isDark;

  const cards = [
    {
      key: 'marketplace',
      title: 'Marketplace',
      image: iconMarketplaceCrate3D,
      onPress: onOpenMarketplace,
    },
    {
      key: 'games',
      title: 'Game',
      image: iconGamesGamepad3D,
      onPress: onOpenGames,
    },
  ];

  return (
    <View>
      <Text
        style={[
          styles.title,
          { color: isDark ? tokens.text.primary : tokens.text.primary },
        ]}
      >
        Feature Hub
      </Text>

      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.key}
            onPress={card.onPress}
            activeOpacity={0.9}
            style={styles.card}
          >
            <Image
              source={card.image}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FeatureHub;

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
  card: {
    flex: 1,
    minHeight: 152,
    borderRadius: tokens.borderRadius['2xl'],
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
