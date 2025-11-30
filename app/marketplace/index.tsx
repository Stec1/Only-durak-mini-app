import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { SlidersHorizontal } from 'lucide-react-native';

import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';
import { JOKER_SPOTLIGHT, MOCK_DECKS, type DeckForSale, type JokerSpotlightItem } from '@/src/data/marketplaceMocks';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'decks', label: 'Decks' },
  { key: 'jokers', label: 'Jokers' },
] as const;

const SCREEN_PADDING = tokens.spacing.lg;

function getToneGradient(tone: JokerSpotlightItem['tone'], theme: ReturnType<typeof useTokens>) {
  switch (tone) {
    case 'blue':
      return [withAlpha(theme.accentBlue, theme.isDark ? 0.25 : 0.18), withAlpha(theme.accent, theme.isDark ? 0.55 : 0.4)];
    case 'pink':
      return [withAlpha(theme.accentNeon, theme.isDark ? 0.22 : 0.16), withAlpha(theme.accentSoft, theme.isDark ? 0.5 : 0.38)];
    default:
      return [withAlpha(theme.accent, theme.isDark ? 0.24 : 0.18), withAlpha(theme.accentBlue, theme.isDark ? 0.5 : 0.36)];
  }
}

function withAlpha(color: string, alpha: number) {
  if (color.startsWith('#')) {
    const normalized = color.replace('#', '');
    const bigint = parseInt(normalized.length === 3 ? normalized.repeat(2) : normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (color.startsWith('rgb')) {
    const parts = color
      .replace(/rgba?\(/, '')
      .replace(')', '')
      .split(',')
      .map((part) => Number(part.trim()))
      .slice(0, 3);
    const [r, g, b] = parts;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
}

type FilterKey = (typeof FILTERS)[number]['key'];

export default function MarketplaceScreen() {
  const theme = useTokens();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('all');
  const styles = useMemo(() => createStyles(theme), [theme]);

  const deckCards = useMemo(() => {
    if (selectedFilter === 'decks' || selectedFilter === 'all') return MOCK_DECKS;
    return [];
  }, [selectedFilter]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + tokens.spacing.md }]}> 
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + tokens.spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, theme.isDark ? styles.headerGlass : styles.headerSolid]}>
          <View style={styles.headerTextGroup}>
            <Text style={[styles.title, { color: theme.text }]}>Marketplace</Text>
            <Text style={[styles.subtitle, { color: theme.subtext }]}>Trade decks & Jokers</Text>
          </View>
          <Pressable
            onPress={() => {}}
            style={[styles.iconButton, theme.isDark ? styles.iconButtonDark : styles.iconButtonLight]}
            hitSlop={10}
          >
            <SlidersHorizontal color={theme.text} size={20} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Joker Spotlight</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.subtext }]}>Featured Joker NFTs</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.spotlightRow}>
            {JOKER_SPOTLIGHT.map((joker) => (
              <View
                key={joker.id}
                style={[
                  styles.jokerCard,
                  theme.isDark ? styles.jokerCardDark : styles.jokerCardLight,
                  { borderColor: theme.border },
                ]}
              >
                <LinearGradient colors={getToneGradient(joker.tone, theme)} style={styles.jokerArt}>
                  <View style={[styles.jokerBadge, { backgroundColor: withAlpha(theme.accent, 0.22) }]}>
                    <Text style={[styles.badgeText, { color: theme.text }]}>{joker.rarity}</Text>
                  </View>
                </LinearGradient>
                <View style={styles.jokerMeta}>
                  <Text style={[styles.jokerName, { color: theme.text }]}>{joker.name}</Text>
                  <View style={[styles.pricePill, { backgroundColor: withAlpha(theme.accent, theme.isDark ? 0.2 : 0.12) }]}>
                    <Text style={[styles.priceText, { color: theme.accent }]}>{joker.price}c</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.filterRow, { borderColor: theme.border }]}>
          <View style={styles.filterPills}>
            {FILTERS.map((filter) => {
              const isActive = selectedFilter === filter.key;
              return (
                <Pressable
                  key={filter.key}
                  onPress={() => setSelectedFilter(filter.key)}
                  style={[
                    styles.filterPill,
                    {
                      backgroundColor: isActive
                        ? withAlpha(theme.accent, theme.isDark ? 0.28 : 0.16)
                        : withAlpha(theme.border, 0.6),
                      borderColor: isActive ? theme.accent : withAlpha(theme.border, 0.8),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterLabel,
                      { color: isActive ? theme.text : theme.subtext },
                    ]}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.sortButton} onPress={() => {}}>
            <Text style={[styles.sortText, { color: theme.subtext }]}>Sort: Newest</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Decks for sale</Text>

          <View style={styles.deckGrid}>
            {deckCards.map((deck) => (
              <DeckCard key={deck.id} deck={deck} onPress={() => router.push(`/marketplace/deck/${deck.id}` as const)} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function DeckCard({ deck, onPress }: { deck: DeckForSale; onPress: () => void }) {
  const theme = useTokens();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const accentColor = useMemo(
    () =>
      ({
        accent: theme.accent,
        accentBlue: theme.accentBlue,
        accentNeon: theme.accentNeon,
        accentSoft: theme.accentSoft,
      }[deck.accentKey]),
    [deck.accentKey, theme.accent, theme.accentBlue, theme.accentNeon, theme.accentSoft]
  );

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.deckCard,
        theme.isDark ? styles.deckCardDark : styles.deckCardLight,
        { borderColor: theme.border },
      ]}
    >
      <LinearGradient
        colors={[withAlpha(accentColor, 0.24), withAlpha(theme.accent, theme.isDark ? 0.18 : 0.12)]}
        style={styles.deckPreview}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.deckBadge, { backgroundColor: withAlpha(theme.bg, 0.25), borderColor: withAlpha(theme.border, 0.7) }]}> 
          <Text style={[styles.deckBadgeText, { color: theme.text }]}>{deck.cardsCount} cards</Text>
        </View>
        <View style={[styles.deckStripe, { backgroundColor: withAlpha(accentColor, 0.75) }]} />
      </LinearGradient>

      <View style={styles.deckMeta}>
        <Text style={[styles.deckTitle, { color: theme.text }]} numberOfLines={1}>
          {deck.name}
        </Text>
        <Text style={[styles.deckCreator, { color: theme.subtext }]}>{deck.creator}</Text>
      </View>

      <View style={[styles.priceTag, { backgroundColor: withAlpha(accentColor, theme.isDark ? 0.24 : 0.16) }]}>
        <Text style={[styles.priceTagText, { color: theme.text }]}>{deck.price}c</Text>
      </View>
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTokens>) {
  const cardWidth = (Dimensions.get('window').width - SCREEN_PADDING * 2 - tokens.spacing.md) / 2;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg,
      paddingHorizontal: SCREEN_PADDING,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: tokens.spacing.lg,
      borderRadius: 24,
      borderWidth: 1,
      marginBottom: tokens.spacing.lg,
    },
    headerGlass: {
      backgroundColor: 'rgba(255,255,255,0.04)',
      borderColor: 'rgba(255,255,255,0.08)',
      shadowColor: '#3CF2FF',
      shadowOpacity: 0.15,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
    },
    headerSolid: {
      backgroundColor: theme.surfaceElevated,
      borderColor: theme.borderSubtle,
      shadowColor: theme.cardShadow.shadowColor,
      shadowOpacity: theme.cardShadow.shadowOpacity,
      shadowRadius: theme.cardShadow.shadowRadius,
      shadowOffset: theme.cardShadow.shadowOffset,
      elevation: theme.cardShadow.elevation,
    },
    headerTextGroup: {
      gap: tokens.spacing.xs,
    },
    title: {
      fontSize: 26,
      fontWeight: '800',
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '600',
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
    iconButtonDark: {
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(255,255,255,0.14)',
    },
    iconButtonLight: {
      backgroundColor: theme.accentSoft,
      borderColor: theme.borderSubtle,
    },
    section: {
      marginBottom: tokens.spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
    },
    sectionSubtitle: {
      fontSize: 14,
      fontWeight: '600',
      marginTop: tokens.spacing.xs,
    },
    spotlightRow: {
      paddingVertical: tokens.spacing.md,
      gap: tokens.spacing.md,
    },
    jokerCard: {
      width: 180,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
    },
    jokerCardDark: {
      backgroundColor: 'rgba(255,255,255,0.04)',
      shadowColor: '#000',
      shadowOpacity: 0.28,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
    },
    jokerCardLight: {
      backgroundColor: theme.cardBg,
      shadowColor: theme.cardShadow.shadowColor,
      shadowOpacity: theme.cardShadow.shadowOpacity,
      shadowRadius: theme.cardShadow.shadowRadius,
      shadowOffset: theme.cardShadow.shadowOffset,
      elevation: theme.cardShadow.elevation,
    },
    jokerArt: {
      height: 180,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      justifyContent: 'flex-start',
    },
    jokerBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderBottomRightRadius: 12,
      borderTopLeftRadius: 18,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.18)',
      margin: tokens.spacing.sm,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '800',
    },
    jokerMeta: {
      padding: tokens.spacing.md,
      gap: tokens.spacing.xs,
    },
    jokerName: {
      fontSize: 16,
      fontWeight: '800',
    },
    pricePill: {
      alignSelf: 'flex-start',
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderRadius: 12,
    },
    priceText: {
      fontSize: 13,
      fontWeight: '700',
    },
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: tokens.spacing.sm,
      borderBottomWidth: 1,
      marginBottom: tokens.spacing.lg,
    },
    filterPills: {
      flexDirection: 'row',
      gap: tokens.spacing.sm,
    },
    filterPill: {
      borderWidth: 1,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
      borderRadius: 12,
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: '700',
    },
    sortButton: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
    },
    sortText: {
      fontSize: 14,
      fontWeight: '700',
    },
    deckGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.md,
    },
    deckCard: {
      width: cardWidth,
      borderRadius: 18,
      borderWidth: 1,
      padding: tokens.spacing.md,
      gap: tokens.spacing.sm,
      position: 'relative',
    },
    deckCardDark: {
      backgroundColor: 'rgba(255,255,255,0.04)',
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
    },
    deckCardLight: {
      backgroundColor: theme.cardBg,
      shadowColor: theme.cardShadow.shadowColor,
      shadowOpacity: theme.cardShadow.shadowOpacity,
      shadowRadius: theme.cardShadow.shadowRadius,
      shadowOffset: theme.cardShadow.shadowOffset,
      elevation: theme.cardShadow.elevation,
    },
    deckPreview: {
      height: 140,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.12)',
      marginBottom: tokens.spacing.xs,
      justifyContent: 'flex-end',
      padding: tokens.spacing.sm,
    },
    deckBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 6,
      borderRadius: 10,
      borderWidth: 1,
    },
    deckBadgeText: {
      fontSize: 12,
      fontWeight: '700',
    },
    deckStripe: {
      position: 'absolute',
      width: 90,
      height: 6,
      bottom: tokens.spacing.sm,
      right: tokens.spacing.sm,
      borderRadius: 3,
      opacity: 0.9,
    },
    deckMeta: {
      gap: 2,
    },
    deckTitle: {
      fontSize: 15,
      fontWeight: '800',
    },
    deckCreator: {
      fontSize: 13,
      fontWeight: '600',
    },
    priceTag: {
      position: 'absolute',
      top: tokens.spacing.sm,
      right: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 6,
      borderRadius: 12,
    },
    priceTagText: {
      fontSize: 13,
      fontWeight: '800',
    },
  });
}
