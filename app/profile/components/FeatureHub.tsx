// app/profile/components/FeatureHub.tsx

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const marketplaceImage = require('../../../assets/images/icon_marketplace_crate_3d.png');
const gamepadImage = require('../../../assets/images/icon_games_gamepad_3d.png');

interface FeatureHubProps {
  onOpenMarketplace: () => void;
  onOpenGames: () => void;
}

const CARD_HEIGHT = 160; // можна підкрутити під твій смак

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
  },
  card: {
    width: '48%',
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#050608', // щоб не було мерехтіння при завантаженні
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'yellow',
  },
});

export default FeatureHub;
