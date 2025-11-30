import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gamepad2, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react-native';

import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';

interface FeatureHubProps {
  onOpenMarketplace: () => void;
  onOpenGames: () => void;
  onOpenEarnings: () => void;
  onOpenJokers: () => void;
}

export default function FeatureHub({ onOpenMarketplace, onOpenGames, onOpenEarnings, onOpenJokers }: FeatureHubProps) {
  const theme = useTokens();
  const cards = [
    {
      key: 'marketplace',
      title: 'Marketplace',
      subtitle: 'Trade decks & Jokers',
      icon: <ShoppingBag color={theme.accent} size={24} strokeWidth={2.5} />,
      onPress: onOpenMarketplace,
    },
    {
      key: 'games',
      title: 'Games',
      subtitle: 'Host or join matches',
      icon: <Gamepad2 color={theme.accent} size={24} strokeWidth={2.5} />,
      onPress: onOpenGames,
    },
    {
      key: 'earnings',
      title: 'Earnings',
      subtitle: 'Track performance',
      icon: <TrendingUp color={theme.accent} size={24} strokeWidth={2.5} />,
      onPress: onOpenEarnings,
    },
    {
      key: 'jokers',
      title: 'Joker NFTs',
      subtitle: 'Collect rare cards',
      icon: <Sparkles color={theme.accent} size={24} strokeWidth={2.5} />,
      onPress: onOpenJokers,
    },
  ];

  return (
    <View>
      <Text style={[styles.title, { color: theme.text }]}>Feature Hub</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={240}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
      >
        {cards.map((card) => (
          <TouchableOpacity
            key={card.key}
            activeOpacity={0.8}
            style={[styles.card, { borderColor: theme.border }]}
            onPress={card.onPress}
          >
            <View style={styles.iconWrap}>{card.icon}</View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{card.title}</Text>
            <Text style={[styles.cardSubtitle, { color: theme.subtext }]}>{card.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: tokens.spacing.sm,
  },
  carouselContent: {
    gap: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
  },
  card: {
    width: 220,
    padding: tokens.spacing.lg,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    // @ts-expect-error web-only blur support
    backdropFilter: 'blur(22px)',
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.25)',
    shadowColor: '#3CF2FF',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    gap: tokens.spacing.sm,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 228, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.4)',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
});
