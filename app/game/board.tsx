import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/src/theme/tokens';
import { Info } from 'lucide-react-native';
import Screen from '@/src/components/ui/Screen';

const mockHand = [
  { id: '1', rank: '9', suit: '♥' },
  { id: '2', rank: 'K', suit: '♠' },
  { id: '3', rank: 'A', suit: '♦' },
  { id: '4', rank: '7', suit: '♣' },
  { id: '5', rank: 'Q', suit: '♥' },
];

const mockTable = [
  { attack: { rank: '6', suit: '♠' }, defend: null },
  { attack: '10', suit: '♥', defend: { rank: 'K', suit: '♥' } },
];

export default function Board() {
  const router = useRouter();

  return (
    <Screen style={styles.content}>
        {Platform.OS === 'web' && (
          <View style={styles.infoBanner}>
            <Info color="#19E3E3" size={20} strokeWidth={2.5} />
            <Text style={styles.infoText}>
              Multiplayer disabled on Web preview
            </Text>
          </View>
        )}

        <View style={styles.gameInfo}>
          <Text style={styles.infoItem}>Trump: ♥</Text>
          <Text style={styles.infoItem}>Deck: 18</Text>
          <Text style={styles.infoItem}>Phase: attack</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Table</Text>
          <View style={styles.tableArea}>
            {mockTable.map((pair, index) => (
              <View key={index} style={styles.tablePair}>
                <View style={styles.miniCard}>
                  <Text style={styles.cardText}>
                    {pair.attack.rank}
                    {pair.attack.suit}
                  </Text>
                </View>
                {pair.defend && (
                  <View style={[styles.miniCard, styles.defendCard]}>
                    <Text style={styles.cardText}>
                      {pair.defend.rank}
                      {pair.defend.suit}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Hand</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.handContainer}
          >
            {mockHand.map((card) => (
              <View key={card.id} style={styles.handCard}>
                <Text style={styles.cardText}>
                  {card.rank}
                  {card.suit}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.actionsContainer}>
          <Pressable style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>Play Card</Text>
          </Pressable>

          <Pressable style={styles.btnOutline}>
            <Text style={styles.btnOutlineText}>Take Cards</Text>
          </Pressable>

          <Pressable
            style={styles.btnOutline}
            onPress={() => router.replace('/game/room' as any)}
          >
            <Text style={styles.btnOutlineText}>Leave Game</Text>
          </Pressable>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: tokens.spacing.lg,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    backgroundColor: 'rgba(25, 227, 227, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(25, 227, 227, 0.3)',
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  infoText: {
    flex: 1,
    color: '#19E3E3',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.xl,
  },
  infoItem: {
    ...tokens.typography.body,
    color: 'rgba(230, 231, 235, 0.7)',
  },
  section: {
    marginBottom: tokens.spacing.xl,
  },
  sectionTitle: {
    ...tokens.typography.h4,
    color: tokens.text.primary,
    marginBottom: tokens.spacing.md,
  },
  tableArea: {
    backgroundColor: '#241F28',
    borderRadius: tokens.borderRadius.xl,
    padding: tokens.spacing.lg,
    minHeight: 120,
    gap: tokens.spacing.md,
  },
  tablePair: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    alignItems: 'center',
  },
  miniCard: {
    width: 64,
    height: 88,
    backgroundColor: '#2f2a33',
    borderRadius: tokens.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(230, 231, 235, 0.1)',
  },
  defendCard: {
    marginLeft: -20,
  },
  cardText: {
    ...tokens.typography.h3,
    color: tokens.text.primary,
  },
  handContainer: {
    gap: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
  },
  handCard: {
    width: 80,
    height: 112,
    backgroundColor: '#241F28',
    borderRadius: tokens.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#19E3E3',
  },
  actionsContainer: {
    gap: tokens.spacing.md,
    marginTop: 'auto',
  },
  btnPrimary: {
    height: 54,
    borderRadius: 999,
    backgroundColor: '#19E3E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  btnOutline: {
    height: 54,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#19E3E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    color: '#19E3E3',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
