import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const marketplaceImage = require('../../../assets/images/icon_marketplace_crate_3d.png');
const gamepadImage = require('../../../assets/images/icon_games_gamepad_3d.png');

interface FeatureHubProps {
  onOpenMarketplace: () => void;
  onOpenGames: () => void;
}

const FeatureHub: React.FC<FeatureHubProps> = ({
  onOpenMarketplace,
  onOpenGames,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Feature Hub</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={onOpenMarketplace}
        >
          <Image
            source={marketplaceImage}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={onOpenGames}
        >
          <Image
            source={gamepadImage}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1,
  },
});

export default FeatureHub;
