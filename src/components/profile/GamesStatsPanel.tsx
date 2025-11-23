import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Trophy } from 'lucide-react-native';
import { tokens } from '@/src/theme/tokens';

type MatchResult = 'W' | 'L';

type Match = {
  id: string;
  date: string;
  fan: string;
  result: MatchResult;
  nftChange: number;
  credits: number;
};

type Summary = {
  total: number;
  wins: number;
  losses: number;
  winrate: number;
  nftWon: number;
  nftLost: number;
  credits: number;
};

type GamesStatsPanelProps = {
  summary: Summary;
  recent: Match[];
};

export default function GamesStatsPanel({ summary, recent }: GamesStatsPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Win Rate</Text>
          <Text style={styles.summaryValue}>{summary.winrate.toFixed(1)}%</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>W / L</Text>
          <Text style={styles.summaryValue}>{summary.wins} / {summary.losses}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>NFT Won</Text>
          <Text style={[styles.summaryValue, { color: '#3AFFFF' }]}>+{summary.nftWon}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>NFT Lost</Text>
          <Text style={[styles.summaryValue, { color: '#FF4D7A' }]}>-{summary.nftLost}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.recentTitle}>Recent Matches</Text>

      <View style={styles.matchesList}>
        {recent.map((match) => (
          <View key={match.id} style={styles.matchRow}>
            <View style={styles.matchLeft}>
              <View style={[
                styles.resultBadge, 
                match.result === 'W' ? styles.resultWin : styles.resultLoss
              ]}>
                {match.result === 'W' ? (
                  <Trophy color="#0F1419" size={14} strokeWidth={2.5} />
                ) : (
                  <Text style={styles.resultText}>L</Text>
                )}
              </View>
              
              <View style={styles.matchInfo}>
                <Text style={styles.fanName}>{match.fan}</Text>
                <Text style={styles.matchDate}>{match.date}</Text>
              </View>
            </View>

            <View style={styles.matchRight}>
              {match.nftChange !== 0 && (
                <View style={[
                  styles.nftBadge,
                  match.nftChange > 0 ? styles.nftPositive : styles.nftNegative
                ]}>
                  <Text style={styles.nftText}>
                    {match.nftChange > 0 ? '+' : ''}{match.nftChange} NFT
                  </Text>
                </View>
              )}
              
              <View style={styles.creditsContainer}>
                {match.credits > 0 ? (
                  <TrendingUp color="#3AFFFF" size={16} strokeWidth={2.5} />
                ) : (
                  <TrendingDown color="#FF4D7A" size={16} strokeWidth={2.5} />
                )}
                <Text style={[
                  styles.creditsValue,
                  match.credits > 0 ? styles.creditsPositive : styles.creditsNegative
                ]}>
                  {match.credits > 0 ? '+' : ''}{match.credits}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  summaryCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: tokens.spacing.md,
  },
  summaryLabel: {
    color: tokens.text.secondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    color: tokens.text.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: tokens.spacing.xs,
  },
  recentTitle: {
    color: tokens.text.primary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.xs,
  },
  matchesList: {
    gap: tokens.spacing.sm,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  matchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    flex: 1,
  },
  resultBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultWin: {
    backgroundColor: '#3AFFFF',
  },
  resultLoss: {
    backgroundColor: '#FF4D7A',
  },
  resultText: {
    color: '#0F1419',
    fontSize: 14,
    fontWeight: '900',
  },
  matchInfo: {
    flex: 1,
  },
  fanName: {
    color: tokens.text.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  matchDate: {
    color: tokens.text.secondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  matchRight: {
    alignItems: 'flex-end',
    gap: tokens.spacing.xs,
  },
  nftBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nftPositive: {
    backgroundColor: 'rgba(58, 255, 255, 0.15)',
  },
  nftNegative: {
    backgroundColor: 'rgba(255, 77, 122, 0.15)',
  },
  nftText: {
    color: tokens.text.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  creditsValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  creditsPositive: {
    color: '#3AFFFF',
  },
  creditsNegative: {
    color: '#FF4D7A',
  },
});
