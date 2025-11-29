import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import GlassCard from '@/components/GlassCard';
import HoloButton from '@/components/HoloButton';
import { tokens } from '@/src/theme/tokens';
import { useTokens } from '@/src/contexts/theme';

export default function QuickPlay() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const themeTokens = useTokens();
  const styles = useMemo(() => createStyles(themeTokens), [themeTokens]);

  const handleFindGame = useCallback(() => {
    router.push('/game/room' as any);
  }, [router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: themeTokens.bg }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + tokens.spacing.xl,
              paddingBottom: insets.bottom + tokens.spacing['2xl'],
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <GlassCard style={styles.card}>
            <Text style={styles.label}>QUICK PLAY</Text>
            <Text style={styles.title}>Jump into Room 3</Text>
            <Text style={[styles.subtitle, { color: themeTokens.subtext }]}>
              Join the first available Room 3 or automatically create a new match.
            </Text>

            <HoloButton title="Find Game" onPress={handleFindGame} style={styles.primaryButton} />

            <TouchableOpacity onPress={handleBack} style={[styles.secondaryButton, { borderColor: themeTokens.border }]}>
              <Text style={[styles.secondaryText, { color: themeTokens.accent }]}>Back to Game hub</Text>
            </TouchableOpacity>

            <View style={[styles.metaPill, { borderColor: themeTokens.border, backgroundColor: themeTokens.cardBg }]}>
              <Text style={[styles.metaText, { color: themeTokens.subtext }]}>1 Model • 2 Fans • 5 Games • 10 credits per loss</Text>
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (themeTokens: ReturnType<typeof useTokens>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: tokens.spacing.lg,
    },
    card: {
      gap: tokens.spacing.lg,
    },
    label: {
      ...tokens.typography.meta,
      color: themeTokens.subtext,
      letterSpacing: 1,
    },
    title: {
      ...tokens.typography.h2,
      color: themeTokens.text,
    },
    subtitle: {
      ...tokens.typography.body,
      lineHeight: 22,
    },
    primaryButton: {
      width: '100%',
    },
    secondaryButton: {
      width: '100%',
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.lg,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeTokens.bg,
    },
    secondaryText: {
      ...tokens.typography.h4,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    metaPill: {
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.md,
      borderRadius: tokens.borderRadius.xl,
      borderWidth: 1,
      alignSelf: 'flex-start',
    },
    metaText: {
      ...tokens.typography.caption,
    },
  });
