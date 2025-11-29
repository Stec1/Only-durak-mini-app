import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Trophy, Coins, Sparkles } from 'lucide-react-native';
import GlassCard from '@/components/GlassCard';
import SolidCard from '@/components/SolidCard';
import Divider from '@/components/Divider';
import { tokens } from '@/src/theme/tokens';
import { useTokens } from '@/src/contexts/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const themeTokens = useTokens();
  const styles = useMemo(() => createStyles(themeTokens), [themeTokens]);
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);
  const [deckSectionY, setDeckSectionY] = useState(0);

  const handleNavigateGame = () => {
    router.push('/game');
  };

  const handleScrollToDecks = () => {
    scrollRef.current?.scrollTo({ y: Math.max(deckSectionY - tokens.spacing.lg, 0), animated: true });
  };

  const infoCards = [
    {
      title: 'Strategy + NFT',
      description: 'Classic Durak where every win can change NFT ownership.',
      Icon: Trophy,
    },
    {
      title: 'AI Model Decks',
      description: 'Each model has a personal 36-card AI deck and Joker NFTs.',
      Icon: Sparkles,
    },
    {
      title: 'In-game economy',
      description: 'Credits, Joker stakes and post-match NFT trading.',
      Icon: Coins,
    },
  ];

  const timelineSteps = [
    {
      title: 'Match with stakes',
      description: 'Model puts Jokers on the line. Fans compete for them in Room 3.',
    },
    {
      title: 'Winners & Jokers',
      description: 'One fan can take both Jokers or they can be split between two fans.',
    },
    {
      title: 'Trade or hold',
      description: 'Fans can propose safe NFT swaps secured by a smart swap mechanism.',
    },
  ];

  const roadmapPhases = [
    { title: 'Phase I — Core Room 3', description: 'Base matches, personalized decks, Joker NFTs.' },
    { title: 'Phase II — Marketplace', description: 'Swaps, trades and auctions between fans.' },
    { title: 'Phase III — Ranked Seasons', description: 'Ratings, seasonal rewards, competitive play.' },
    { title: 'Phase IV — Metagame', description: 'Cross-project collabs, special events, themed decks.' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: themeTokens.bg }]}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + tokens.spacing.xl,
            paddingBottom: insets.bottom + tokens.spacing['2xl'],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrapper}>
          <View style={styles.heroBackground}>
            {/* TODO: Replace this static background with animated gradient / parallax later */}
          </View>
          <GlassCard style={styles.heroCard}>
            <Text style={styles.eyebrow}>WELCOME TO</Text>
            <Text style={styles.heroTitle}>Only Durak</Text>
            <Text style={styles.heroSubtitle}>
              Strategic card ecosystem where “Durak” is played for AI model decks, NFT Jokers and real digital ownership.
            </Text>

            <View style={styles.heroActions}>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: themeTokens.accent }]} onPress={handleNavigateGame}>
                <Text style={styles.primaryButtonText}>PLAY NOW</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleScrollToDecks}>
                <Text style={[styles.secondaryButtonText, { color: themeTokens.accent }]}>HOW IT WORKS</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.marquee, { borderColor: themeTokens.border }]}>
              <Text style={styles.marqueeText}>PLAY • COLLECT • OWN • TRADE • REPEAT</Text>
            </View>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is Only Durak?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCards}
          >
            {infoCards.map(({ title, description, Icon }) => (
              <SolidCard key={title} style={styles.infoCard}>
                <View style={styles.infoIconCircle}>
                  <Icon color={themeTokens.accent} size={22} />
                </View>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
              </SolidCard>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.linkButton} onPress={handleScrollToDecks}>
            <Text style={[styles.linkText, { color: themeTokens.accent }]}>See more ↓</Text>
          </TouchableOpacity>
        </View>

        <Divider style={styles.sectionDivider} />

        <View
          style={styles.section}
          onLayout={(event) => setDeckSectionY(event.nativeEvent.layout.y)}
        >
          <Text style={styles.metaLabel}>PERSONALIZED DECKS</Text>
          <Text style={styles.sectionTitle}>AI Model Decks</Text>
          <Text style={styles.sectionSubtitle}>
            Every model has a personal collectible AI deck:
            {'\n'}• 36 unique AI cards of her image
            {'\n'}• Red Joker — the first rare NFT
            {'\n'}• Black Joker — the crown of the deck
          </Text>

          <SolidCard style={styles.deckPreview}>
            <Text style={styles.deckPreviewTitle}>Deck Preview</Text>
            <View style={styles.deckPreviewPlaceholder}>
              <Text style={styles.placeholderText}>Deck Preview</Text>
              {/* TODO: Replace this placeholder with real deck PNG/SVG preview image(s) */}
            </View>
            <View style={styles.miniCardsRow}>
              {Array.from({ length: 4 }).map((_, index) => (
                <View key={index} style={styles.miniCard}>
                  <Text style={styles.placeholderText}>AI</Text>
                </View>
              ))}
            </View>
          </SolidCard>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Red vs Black Joker</Text>
          <View style={styles.jokerRow}>
            <SolidCard style={[styles.jokerCard, styles.jokerCardSpacing]}>
              <Text style={styles.cardTitle}>Red Joker</Text>
              <Text style={styles.cardDescription}>
                First rare NFT of a model.{"\n"}
                A fan gets it if they put the model in Durak twice in a row in one match.
              </Text>
              <View style={styles.jokerPlaceholder}>
                <Text style={styles.placeholderText}>Red Joker</Text>
                {/* TODO: Replace this placeholder with Red / Black Joker NFT artwork */}
              </View>
            </SolidCard>
            <SolidCard style={styles.jokerCard}>
              <Text style={styles.cardTitle}>Black Joker</Text>
              <Text style={styles.cardDescription}>
                Main high-value NFT of the deck.{"\n"}
                Played in a special match after the Red Joker is lost.{"\n"}
                Winner keeps it forever.
              </Text>
              <View style={styles.jokerPlaceholder}>
                <Text style={styles.placeholderText}>Black Joker</Text>
                {/* TODO: Replace this placeholder with Red / Black Joker NFT artwork */}
              </View>
            </SolidCard>
          </View>
          <Text style={styles.centerCaption}>
            Every Joker is an NFT with ownership history, unique ID, and transparent transfer track.
          </Text>
        </View>

        <Divider style={styles.sectionDivider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room 3 — Main Game Mode</Text>
          <Text style={styles.sectionSubtitle}>
            1 Model • 2 Fans • 5 games per match.{"\n"}
            Everyone plays for themselves, under classic Durak rules.
          </Text>
          <View style={styles.bulletList}>
            {[
              'Loser of each game pays 10 credits',
              'Model earns from fans’ losses and table creation',
              'Stakes are real: you play for credits and NFT Jokers',
            ].map((item) => (
              <View key={item} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: themeTokens.accent }]} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.playersRow}>
            <View style={styles.playerCircle}>
              <Text style={styles.placeholderText}>Fan</Text>
            </View>
            <View style={[styles.playerCircle, styles.modelCircle]}>
              <Text style={[styles.placeholderText, styles.modelLabel]}>Model</Text>
            </View>
            <View style={styles.playerCircle}>
              <Text style={styles.placeholderText}>Fan</Text>
            </View>
          </View>
          <View style={[styles.pill, { borderColor: themeTokens.border }]}>
            <Text style={[styles.pillText, { color: themeTokens.accent }]}>High stakes: matches decide who owns the Jokers.</Text>
          </View>
        </View>

        <Divider style={styles.sectionDivider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NFT flow after the match</Text>
          <View style={styles.timeline}>
            {timelineSteps.map((step, index) => (
              <View key={step.title} style={styles.timelineRow}>
                <View style={[styles.stepCircle, { borderColor: themeTokens.accent }]}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.cardTitle}>{step.title}</Text>
                  <Text style={styles.cardDescription}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.secondaryButton, styles.flowButton]}
            onPress={() => {
              /* TODO: navigate to detailed flow screen */
            }}
          >
            <Text style={[styles.secondaryButtonText, { color: themeTokens.accent }]}>View NFT flow</Text>
          </TouchableOpacity>
        </View>

        <Divider style={styles.sectionDivider} />

        <View style={styles.section}>
          <SolidCard style={styles.economyCard}>
            <Text style={styles.sectionTitle}>In-game economy</Text>
            <View style={styles.bulletList}>
              {[
                '10 credits — stake per game (paid by the loser)',
                'Models earn from matches and Joker stakes',
                'Platform takes a small fee',
                'Rarer sets = more valuable model accounts',
              ].map((item) => (
                <View key={item} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: themeTokens.accent }]} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </SolidCard>

          <Text style={[styles.sectionSubtitle, styles.roadmapSubtitle]}>Roadmap</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.roadmapScroll}
          >
            {roadmapPhases.map((phase) => (
              <SolidCard key={phase.title} style={styles.roadmapCard}>
                <Text style={styles.cardTitle}>{phase.title}</Text>
                <Text style={styles.cardDescription}>{phase.description}</Text>
              </SolidCard>
            ))}
          </ScrollView>

          <View style={styles.finalBlock}>
            <Text style={styles.finalTitle}>Only Durak</Text>
            <Text style={styles.finalDescription}>
              In every match — a story.{"\n"}
              In every card — an asset.{"\n"}
              In every win — a new trophy.
            </Text>
            <TouchableOpacity style={[styles.primaryButton, styles.finalButton, { backgroundColor: themeTokens.accent }]} onPress={handleNavigateGame}>
              <Text style={styles.primaryButtonText}>GO TO GAME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (themeTokens: ReturnType<typeof useTokens>) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
    gap: tokens.spacing['2xl'],
  },
  heroWrapper: {
    position: 'relative',
  },
  heroBackground: {
    position: 'absolute',
    top: -tokens.spacing.md,
    left: -tokens.spacing.md,
    right: -tokens.spacing.md,
    bottom: -tokens.spacing.md,
    borderRadius: tokens.borderRadius['2xl'],
    backgroundColor: 'rgba(73,214,229,0.06)',
  },
  heroCard: {
    overflow: 'hidden',
  },
  eyebrow: {
    ...tokens.typography.meta,
    color: themeTokens.subtext,
    marginBottom: tokens.spacing.xs,
  },
  heroTitle: {
    ...tokens.typography.h1,
    color: themeTokens.text,
    marginBottom: tokens.spacing.sm,
  },
  heroSubtitle: {
    ...tokens.typography.body,
    color: themeTokens.subtext,
    lineHeight: 22,
    marginBottom: tokens.spacing.lg,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  primaryButton: {
    paddingVertical: tokens.spacing.sm + 2,
    paddingHorizontal: tokens.spacing['2xl'],
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...tokens.typography.h4,
    color: themeTokens.bg,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  secondaryButton: {
    paddingVertical: tokens.spacing.sm + 2,
    paddingHorizontal: tokens.spacing['2xl'],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: themeTokens.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeTokens.cardBg,
  },
  secondaryButtonText: {
    ...tokens.typography.h4,
    color: themeTokens.text,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  marquee: {
    borderWidth: 1,
    borderColor: themeTokens.border,
    borderRadius: 999,
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marqueeText: {
    ...tokens.typography.caption,
    color: themeTokens.subtext,
    letterSpacing: 2,
  },
  section: {
    gap: tokens.spacing.md,
  },
  sectionTitle: {
    ...tokens.typography.h2,
    color: themeTokens.text,
    fontWeight: '800',
  },
  sectionSubtitle: {
    ...tokens.typography.body,
    color: themeTokens.subtext,
    lineHeight: 22,
  },
  sectionDivider: {
    marginVertical: tokens.spacing.md,
    opacity: 0.7,
  },
  horizontalCards: {
    gap: tokens.spacing.md,
    paddingRight: tokens.spacing.md,
  },
  infoCard: {
    width: 220,
    padding: tokens.spacing.lg,
  },
  infoIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: themeTokens.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
  },
  cardTitle: {
    ...tokens.typography.h4,
    color: themeTokens.text,
    marginBottom: tokens.spacing.xs,
  },
  cardDescription: {
    ...tokens.typography.caption,
    color: themeTokens.subtext,
    lineHeight: 18,
  },
  linkButton: {
    marginTop: tokens.spacing.sm,
    alignSelf: 'flex-start',
  },
  linkText: {
    ...tokens.typography.caption,
    color: themeTokens.subtext,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  metaLabel: {
    ...tokens.typography.meta,
    color: themeTokens.subtext,
  },
  deckPreview: {
    gap: tokens.spacing.md,
    padding: tokens.spacing.lg,
  },
  deckPreviewTitle: {
    ...tokens.typography.h3,
    color: themeTokens.text,
  },
  deckPreviewPlaceholder: {
    height: 180,
    borderRadius: tokens.borderRadius.xl,
    borderWidth: 1,
    borderColor: themeTokens.border,
    backgroundColor: themeTokens.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...tokens.typography.caption,
    color: themeTokens.subtext,
  },
  miniCardsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  miniCard: {
    flex: 1,
    minHeight: 60,
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 1,
    borderColor: themeTokens.border,
    backgroundColor: themeTokens.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jokerRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    flexWrap: 'wrap',
  },
  jokerCard: {
    flex: 1,
    minWidth: 160,
    gap: tokens.spacing.sm,
    padding: tokens.spacing.lg,
  },
  jokerCardSpacing: {
    marginRight: tokens.spacing.xs,
  },
  jokerPlaceholder: {
    height: 120,
    borderRadius: tokens.borderRadius.xl,
    borderWidth: 1,
    borderColor: themeTokens.border,
    backgroundColor: themeTokens.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCaption: {
    ...tokens.typography.caption,
    color: themeTokens.subtext,
    textAlign: 'center',
  },
  bulletList: {
    gap: tokens.spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  bulletDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: themeTokens.accent,
  },
  bulletText: {
    ...tokens.typography.body,
    color: themeTokens.subtext,
    flex: 1,
  },
  playersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  playerCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: themeTokens.border,
    backgroundColor: themeTokens.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: themeTokens.accentSoft,
    borderColor: themeTokens.accent,
  },
  modelLabel: {
    color: themeTokens.text,
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: themeTokens.border,
    backgroundColor: themeTokens.cardBg,
  },
  pillText: {
    ...tokens.typography.caption,
    color: themeTokens.text,
  },
  timeline: {
    gap: tokens.spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    alignItems: 'flex-start',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeTokens.accentSoft,
  },
  stepNumber: {
    ...tokens.typography.h4,
    color: themeTokens.text,
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
    gap: tokens.spacing.xs,
  },
  flowButton: {
    alignSelf: 'flex-start',
    marginTop: tokens.spacing.sm,
  },
  economyCard: {
    gap: tokens.spacing.md,
    padding: tokens.spacing.lg,
  },
  roadmapSubtitle: {
    marginTop: tokens.spacing.lg,
  },
  roadmapScroll: {
    gap: tokens.spacing.md,
    paddingRight: tokens.spacing.md,
  },
  roadmapCard: {
    width: 220,
    gap: tokens.spacing.xs,
    padding: tokens.spacing.lg,
  },
  finalBlock: {
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing['2xl'],
  },
  finalTitle: {
    ...tokens.typography.h2,
    color: themeTokens.text,
    fontWeight: '800',
  },
  finalDescription: {
    ...tokens.typography.body,
    color: themeTokens.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  finalButton: {
    paddingHorizontal: tokens.spacing['2xl'] + 8,
  },
});

