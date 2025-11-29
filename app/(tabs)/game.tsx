import React, { useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/src/state/gameStore';
import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';
import GlassCard from '@/components/GlassCard';
import SolidCard from '@/components/SolidCard';
import StatCard from '@/components/StatCard';
import { mockSummary } from '@/src/data/profileMocks';

export default function GameTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const themeTokens = useTokens();
  const styles = useMemo(() => createStyles(themeTokens), [themeTokens]);
  const { myRoom, phase, actions } = useGameStore();

  useEffect(() => {
    actions.connect();
    actions.listRooms();
  }, [actions]);

  useEffect(() => {
    if (myRoom && phase === 'lobby') router.push('/game/room' as any);
    if (myRoom && phase && phase !== 'lobby') router.push('/game/board' as any);
  }, [myRoom, phase, router]);

  const handleQuickPlay = useCallback(() => {
    router.push('/game/quick' as any);
  }, [router]);

  const handleCreateRoom = useCallback(() => {
    router.push('/game/create' as any);
  }, [router]);

  const handleNavigateHome = useCallback(() => {
    router.push('/home');
  }, [router]);

  const gameModes = useMemo(
    () => [
      {
        key: 'room3',
        title: 'Room 3 (Main)',
        subtitle: 'Main PvP mode for NFTs and credits.',
        status: 'Live',
        onPress: handleQuickPlay,
      },
      {
        key: 'practice',
        title: 'Practice (Soon)',
        subtitle: 'Play without stakes to learn the flow.',
        status: 'Coming soon',
      },
      {
        key: 'custom',
        title: 'Custom Rules (Soon)',
        subtitle: 'Private rooms and custom stakes.',
        status: 'Coming soon',
      },
    ],
    [handleQuickPlay]
  );

  const timelineSteps = [
    {
      title: 'Play match',
      caption: 'Model and fans enter Room 3.',
    },
    {
      title: 'Win Jokers',
      caption: 'Red and Black Joker can move between players.',
    },
    {
      title: 'Trade or hold',
      caption: 'Winners can trade NFTs after the match.',
    },
  ];

  const statusBadges = [
    { label: 'Games today', value: '3' },
    { label: 'Joker NFTs', value: mockSummary.nftWon },
    { label: 'Credits balance', value: `${mockSummary.credits} cr` },
  ];

  return (
    <View style={[styles.container, { backgroundColor: themeTokens.bg }]}>
      <ScrollView
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
        <GlassCard style={styles.heroCard} padding={tokens.spacing.xl}>
          <Text style={styles.eyebrow}>Play Room 3</Text>
          <Text style={styles.heroTitle}>Ready to play?</Text>
          <Text style={styles.heroSubtitle}>
            Room 3 matches with AI model decks, NFT Jokers and real stakes.
          </Text>

          <View style={styles.actionStack}>
            <Pressable style={[styles.primaryBtn, { backgroundColor: themeTokens.accent }]} onPress={handleQuickPlay}>
              <Text style={[styles.primaryLabel, { color: themeTokens.bg }]}>QUICK PLAY</Text>
              <Text style={[styles.primaryCaption, { color: themeTokens.bg }]}>Join a public Room 3 now.</Text>
            </Pressable>

            <Pressable
              style={[styles.secondaryBtn, { borderColor: themeTokens.accent, backgroundColor: themeTokens.bg }]}
              onPress={handleCreateRoom}
            >
              <Text style={[styles.secondaryLabel, { color: themeTokens.accent }]}>CREATE ROOM</Text>
              <Text style={[styles.secondaryCaption, { color: themeTokens.subtext }]}>Set up a match with model + 2 fans.</Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.pill,
              {
                backgroundColor: themeTokens.cardBg,
                borderColor: themeTokens.border,
              },
            ]}
          >
            <Text style={[styles.pillText, { color: themeTokens.subtext }]}>1 Model • 2 Fans • 5 Games • 10 credits per loss</Text>
          </View>
        </GlassCard>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Game modes</Text>
          <Text style={[styles.sectionSubtitle, { color: themeTokens.subtext }]}>
            Pick how you want to enter Room 3
          </Text>
        </View>

        <View style={styles.modesGrid}>
          {gameModes.map((mode) => {
            const disabled = mode.status !== 'Live';
            return (
              <Pressable
                key={mode.key}
                onPress={!disabled ? mode.onPress : undefined}
                disabled={disabled}
                style={[
                  styles.modeCard,
                  {
                    backgroundColor: themeTokens.cardBg,
                    borderColor: themeTokens.border,
                  },
                  disabled && styles.modeCardDisabled,
                ]}
              >
                <View style={styles.modeHeader}>
                  <Text style={[styles.modeTitle, { color: themeTokens.text }]}>{mode.title}</Text>
                  <View
                    style={[
                      styles.badge,
                      disabled
                        ? {
                            borderColor: themeTokens.border,
                            backgroundColor: 'transparent',
                          }
                        : { backgroundColor: themeTokens.accentSoft, borderColor: themeTokens.accentSoft },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: disabled ? themeTokens.subtext : themeTokens.accent },
                      ]}
                    >
                      {disabled ? 'Soon' : 'Live'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.modeSubtitle, { color: themeTokens.subtext }]}>{mode.subtitle}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your status</Text>
          <Text style={[styles.sectionSubtitle, { color: themeTokens.subtext }]}>Quick snapshot before you play</Text>
        </View>
        <View style={styles.statsRow}>
          {statusBadges.map((badge) => (
            <StatCard key={badge.label} value={badge.value} caption={badge.label} />
          ))}
        </View>

        <SolidCard
          style={[styles.infoCard, { backgroundColor: themeTokens.cardBg, borderColor: themeTokens.border }]}
          padding={tokens.spacing.lg}
        >
          <Text style={styles.sectionTitle}>Stakes in Room 3</Text>
          <View style={styles.bulletList}>
            <BulletItem
              color={themeTokens.accent}
              textColor={themeTokens.text}
              text="10 credits — from the loser of each game."
            />
            <BulletItem
              color={themeTokens.accent}
              textColor={themeTokens.text}
              text="Defeat the model twice in a row to claim the Red Joker."
            />
            <BulletItem
              color={themeTokens.accent}
              textColor={themeTokens.text}
              text="A special match decides who wins the Black Joker."
            />
          </View>
          <Text style={[styles.footerNote, { color: themeTokens.subtext }]}>
            Every Joker is an NFT with real ownership history.
          </Text>
        </SolidCard>

        <GlassCard style={styles.timelineCard} padding={tokens.spacing.lg}>
          <Text style={styles.sectionTitle}>NFT flow in a match</Text>
          <View style={styles.timeline}>
            {timelineSteps.map((step, index) => (
              <View key={step.title} style={styles.timelineItem}>
                <View style={[styles.timelineIcon, { borderColor: themeTokens.border, backgroundColor: themeTokens.cardBg }]}>
                  <Text style={[styles.timelineIndex, { color: themeTokens.text }]}>{index + 1}</Text>
                </View>
                <View style={styles.timelineCopy}>
                  <Text style={[styles.timelineTitle, { color: themeTokens.text }]}>{step.title}</Text>
                  <Text style={[styles.timelineCaption, { color: themeTokens.subtext }]}>{step.caption}</Text>
                </View>
              </View>
            ))}
          </View>

          <Pressable style={[styles.linkButton, { borderColor: themeTokens.border }]} onPress={handleNavigateHome}>
            <Text style={[styles.linkLabel, { color: themeTokens.accent }]}>Learn more on Home</Text>
          </Pressable>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

function BulletItem({ color, text, textColor }: { color: string; text: string; textColor?: string }) {
  return (
    <View style={stylesBullet.container}>
      <View style={[stylesBullet.dot, { backgroundColor: color }]} />
      <Text style={[stylesBullet.text, { color: textColor ?? color }]}>{text}</Text>
    </View>
  );
}

const createStyles = (themeTokens: ReturnType<typeof useTokens>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: tokens.spacing.lg,
      gap: tokens.spacing.lg,
    },
    heroCard: {
      gap: tokens.spacing.md,
    },
    eyebrow: {
      ...tokens.typography.meta,
      color: themeTokens.subtext,
    },
    heroTitle: {
      ...tokens.typography.h1,
      color: themeTokens.text,
    },
    heroSubtitle: {
      ...tokens.typography.body,
      color: themeTokens.subtext,
    },
    actionStack: {
      gap: tokens.spacing.sm,
    },
    primaryBtn: {
      borderRadius: tokens.borderRadius['2xl'],
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      gap: tokens.spacing.xs,
    },
    primaryLabel: {
      ...tokens.typography.h4,
      fontWeight: '800',
      letterSpacing: 0.4,
    },
    primaryCaption: {
      ...tokens.typography.caption,
      opacity: 0.9,
    },
    secondaryBtn: {
      borderRadius: tokens.borderRadius['2xl'],
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      borderWidth: 1,
      gap: tokens.spacing.xs,
    },
    secondaryLabel: {
      ...tokens.typography.h4,
      fontWeight: '700',
    },
    secondaryCaption: {
      ...tokens.typography.caption,
    },
    pill: {
      alignSelf: 'flex-start',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
      borderRadius: 999,
      borderWidth: 1,
    },
    pillText: {
      ...tokens.typography.caption,
    },
    sectionHeader: {
      gap: 4,
    },
    sectionTitle: {
      ...tokens.typography.h2,
      color: themeTokens.text,
      fontWeight: '800',
    },
    sectionSubtitle: {
      ...tokens.typography.caption,
    },
    modesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.md,
    },
    modeCard: {
      flexGrow: 1,
      minWidth: 180,
      borderRadius: tokens.borderRadius.xl,
      padding: tokens.spacing.md,
      borderWidth: 1,
      gap: tokens.spacing.xs,
    },
    modeCardDisabled: {
      opacity: 0.65,
    },
    modeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: tokens.spacing.sm,
    },
    modeTitle: {
      ...tokens.typography.h4,
      fontWeight: '700',
    },
    modeSubtitle: {
      ...tokens.typography.caption,
      lineHeight: 20,
    },
    badge: {
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 4,
    },
    badgeText: {
      ...tokens.typography.meta,
      fontSize: 11,
    },
    statsRow: {
      flexDirection: 'row',
      gap: tokens.spacing.md,
      flexWrap: 'wrap',
    },
    infoCard: {
      gap: tokens.spacing.sm,
    },
    bulletList: {
      gap: tokens.spacing.sm,
      marginTop: tokens.spacing.sm,
    },
    footerNote: {
      ...tokens.typography.caption,
      marginTop: tokens.spacing.sm,
    },
    timelineCard: {
      gap: tokens.spacing.md,
    },
    timeline: {
      gap: tokens.spacing.md,
    },
    timelineItem: {
      flexDirection: 'row',
      gap: tokens.spacing.md,
      alignItems: 'flex-start',
    },
    timelineIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timelineIndex: {
      ...tokens.typography.h4,
      fontWeight: '800',
    },
    timelineCopy: {
      flex: 1,
      gap: 4,
    },
    timelineTitle: {
      ...tokens.typography.h4,
      fontWeight: '700',
    },
    timelineCaption: {
      ...tokens.typography.caption,
      lineHeight: 20,
    },
    linkButton: {
      marginTop: tokens.spacing.sm,
      alignSelf: 'flex-start',
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
    },
    linkLabel: {
      ...tokens.typography.h4,
      fontWeight: '700',
    },
  });

const stylesBullet = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  text: {
    ...tokens.typography.body,
    flex: 1,
    lineHeight: 22,
  },
});
