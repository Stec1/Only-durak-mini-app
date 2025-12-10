import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gamepad2, ShoppingBag } from 'lucide-react-native';

import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';

interface FeatureHubProps {
  onOpenMarketplace: () => void;
  onOpenGames: () => void;
}

export default function FeatureHub({ onOpenMarketplace, onOpenGames }: FeatureHubProps) {
  const theme = useTokens();
  const isDark = theme.isDark;
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
  ];

  return (
    <View>
      <Text style={[styles.title, { color: theme.text }]}>Feature Hub</Text>
      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.key}
            activeOpacity={0.8}
            style={[
              styles.cardBase,
              isDark
                ? styles.cardGlass
                : {
                    backgroundColor: theme.surfaceElevated,
                    borderWidth: 1,
                    borderColor: theme.borderSubtle,
                    shadowColor: theme.cardShadow.shadowColor,
                    shadowOpacity: theme.cardShadow.shadowOpacity,
                    shadowRadius: theme.cardShadow.shadowRadius,
                    shadowOffset: theme.cardShadow.shadowOffset,
                    elevation: theme.cardShadow.elevation,
                  },
            ]}
            onPress={card.onPress}
          >
            <View
              style={[
                styles.iconWrap,
                isDark
                  ? styles.iconWrapDark
                  : { backgroundColor: theme.accentSoft, borderColor: theme.borderSubtle },
              ]}
            >
              {card.icon}
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{card.title}</Text>
            <Text style={[styles.cardSubtitle, { color: theme.subtext }]}>{card.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: tokens.spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  cardBase: {
    flex: 1,
    minHeight: 152,
    padding: tokens.spacing.lg,
    borderRadius: 24,
    gap: tokens.spacing.sm,
  },
  cardGlass: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    // @ts-expect-error web-only blur support
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(22px)' } : null),
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.25)',
    shadowColor: '#3CF2FF',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconWrapDark: {
    backgroundColor: 'rgba(0, 228, 255, 0.1)',
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
