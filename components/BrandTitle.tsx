import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useThemeCtx } from '@/src/contexts/theme';

export default function BrandTitle() {
  const { theme } = useThemeCtx();

  return (
    <View style={styles.container}>
      <Text 
        style={[
          styles.only, 
          { color: theme.textPrimary },
        ]}
        accessibilityRole="header"
        allowFontScaling={false}
      >
        Only
      </Text>
      <Text 
        style={[
          styles.durak, 
          { color: theme.textPrimary },
        ]}
        allowFontScaling={false}
      >
        Durak
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    gap: -8,
  },
  only: {
    fontFamily: Platform.select({
      ios: 'Snell Roundhand',
      android: 'cursive',
      default: 'serif',
    }),
    fontSize: 72,
    lineHeight: 80,
    fontStyle: 'italic',
    letterSpacing: 0.5,
    color: '#E6E7EB',
    includeFontPadding: false,
  },
  durak: {
    fontFamily: Platform.select({
      ios: 'Avenir-Heavy',
      android: 'sans-serif-black',
      default: 'Arial Black',
    }),
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 56,
    color: '#E6E7EB',
    includeFontPadding: false,
  },
});
