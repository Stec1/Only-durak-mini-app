import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens } from '@/src/theme/tokens';

export default function GradientBackground() {
  return (
    <LinearGradient
      colors={[
        tokens.bg.gradient.start,
        tokens.bg.gradient.middle,
        tokens.bg.gradient.end,
      ] as const}
      style={styles.background}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0, 0.55, 1]}
    />
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
