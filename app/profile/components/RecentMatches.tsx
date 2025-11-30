import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import GlassCard from '@/components/GlassCard';
import Divider from '@/components/Divider';
import { tokens } from '@/src/theme/tokens';
import { useTokens } from '@/src/contexts/theme';
import { mockRecent } from '@/src/data/profileMocks';

interface RecentMatchesProps {
  matches: typeof mockRecent;
}

export default function RecentMatches({ matches }: RecentMatchesProps) {
  const theme = useTokens();
  const isDark = theme.isDark;

  const cardStyle = [
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
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>Recent Matches</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={[styles.viewAll, { color: theme.accent }]}>View All →</Text>
        </TouchableOpacity>
      </View>

      <GlassCard style={cardStyle} padding={tokens.spacing.lg}>
        {matches.map((match, index) => (
          <View key={match.id}>
            <View style={styles.matchRow}>
              <View style={styles.meta}>
                <Text style={[styles.date, { color: theme.subtext }]}>{match.date}</Text>
                <Text style={[styles.fan, { color: theme.text }]}>{match.fan}</Text>
              </View>
              <View style={styles.resultGroup}>
                <Text style={[styles.result, { color: match.result === 'W' ? '#6CFFCB' : '#FFA8A8' }]}>{match.result}</Text>
                <Text style={[styles.delta, { color: match.nftChange >= 0 ? theme.accent : '#FFA8A8' }]}>
                  {match.nftChange >= 0 ? '+' : ''}
                  {match.nftChange} NFT
                </Text>
                <Text style={[styles.delta, { color: match.credits >= 0 ? theme.accent : '#FFA8A8' }]}>
                  {match.credits >= 0 ? '+' : ''}
                  {match.credits}c
                </Text>
              </View>
            </View>
            {index < matches.length - 1 && <Divider style={styles.divider} />}
          </View>
        ))}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: tokens.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '800',
  },
  cardBase: {
    borderRadius: 24,
  },
  cardGlass: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.25)',
    // @ts-expect-error web-only blur support
    backdropFilter: 'blur(22px)',
    shadowColor: '#3CF2FF',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
  },
  meta: {
    gap: 2,
  },
  date: {
    fontSize: 13,
    fontWeight: '700',
  },
  fan: {
    fontSize: 16,
    fontWeight: '800',
  },
  resultGroup: {
    alignItems: 'flex-end',
    gap: 2,
  },
  result: {
    fontSize: 18,
    fontWeight: '800',
  },
  delta: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    marginVertical: tokens.spacing.sm,
  },
});
