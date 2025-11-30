import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import JokerTile from '@/components/JokerTile';
import { SuitSpade } from '@/components/suits/Spade';
import { SuitHeart } from '@/components/suits/Heart';
import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';

export default function JokerSlots() {
  const theme = useTokens();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: theme.text }]}>Joker Slots</Text>
      <View style={styles.row}>
        <View style={[styles.slot, { borderColor: theme.border }]}>
          <JokerTile
            label="Black Joker"
            storageKey="joker_black_uri"
            iconComponent={
              <View style={[styles.icon, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
                <SuitSpade size={36} color={theme.accent} />
              </View>
            }
          />
        </View>
        <View style={[styles.slot, { borderColor: theme.border }]}>
          <JokerTile
            label="Red Joker"
            storageKey="joker_red_uri"
            iconComponent={
              <View style={[styles.icon, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
                <SuitHeart size={36} color={theme.accent} />
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: tokens.spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  slot: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.25)',
    // @ts-expect-error web-only blur support
    backdropFilter: 'blur(22px)',
    shadowColor: '#3CF2FF',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.25)',
  },
});
