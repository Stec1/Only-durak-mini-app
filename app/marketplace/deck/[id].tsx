import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';
import { MOCK_DECKS } from '@/src/data/marketplaceMocks';

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const theme = useTokens();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const deck = MOCK_DECKS.find((item) => item.id === id);
  const deckName = deck?.name || 'Deck';

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}> 
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={[styles.backPill, { backgroundColor: theme.accentSoft }]} onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.backText, { color: theme.accent }]}>Back</Text>
        </Pressable>

        <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.cardBg }]}> 
          <Text style={[styles.title, { color: theme.text }]}>{deckName}</Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Marketplace deck detail placeholder. Full trading logic coming soon.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTokens>) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: tokens.spacing.lg,
      gap: tokens.spacing.md,
    },
    backPill: {
      alignSelf: 'flex-start',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
      borderRadius: 999,
    },
    backText: {
      fontSize: 14,
      fontWeight: '700',
    },
    card: {
      borderWidth: 1,
      borderRadius: 18,
      padding: tokens.spacing.lg,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      marginBottom: tokens.spacing.sm,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '600',
    },
  });
}
