import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { tokens } from '@/src/theme/tokens';
import { SuitSpade } from '@/components/suits/Spade';
import { SuitHeart } from '@/components/suits/Heart';
import JokerTile from '@/components/JokerTile';

type JokersPanelProps = {
  jokers: unknown[];
  onOpenCollection: () => void;
};

export default function JokersPanel({ jokers, onOpenCollection }: JokersPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tilesRow}>
        <JokerTile
          label="Black Joker"
          storageKey="joker_black_uri"
          iconComponent={
            <View style={styles.jokerIcon}>
              <SuitSpade size={32} color="#3AFFFF" />
            </View>
          }
        />
        <JokerTile
          label="Red Joker"
          storageKey="joker_red_uri"
          iconComponent={
            <View style={styles.jokerIcon}>
              <SuitHeart size={32} color="#3AFFFF" />
            </View>
          }
        />
      </View>

      <TouchableOpacity 
        style={styles.collectionButton}
        onPress={onOpenCollection}
        activeOpacity={0.7}
      >
        <Text style={styles.collectionButtonText}>Open Collection</Text>
        <ArrowRight color={tokens.text.primary} size={18} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.md,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  jokerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(58, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  collectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.xs,
    paddingVertical: tokens.spacing.sm + 2,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(58, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(58, 255, 255, 0.2)',
    marginTop: tokens.spacing.xs,
  },
  collectionButtonText: {
    color: tokens.text.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
