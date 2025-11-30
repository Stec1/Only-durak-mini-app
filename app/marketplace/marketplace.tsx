import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';

import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';

export default function MarketplaceScreen() {
  const theme = useTokens();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.card, { borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Marketplace</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>Buy & Sell custom decks and Jokers</Text>
        <View style={styles.placeholder}>
          <Text style={[styles.placeholderText, { color: theme.subtext }]}>Marketplace coming soon</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: tokens.spacing.lg,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 26,
    padding: tokens.spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.25)',
    // @ts-expect-error web-only blur support
    backdropFilter: 'blur(22px)',
    shadowColor: '#3CF2FF',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    gap: tokens.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    marginTop: tokens.spacing.lg,
    padding: tokens.spacing.lg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.25)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  placeholderText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
