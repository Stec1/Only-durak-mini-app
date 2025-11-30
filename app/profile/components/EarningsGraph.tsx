import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import EarningsChart from '@/src/components/profile/EarningsChart';
import { tokens } from '@/src/theme/tokens';
import { useTokens } from '@/src/contexts/theme';

type DataPoint = {
  x: string;
  y: number;
};

type EarningsGraphProps = {
  data: DataPoint[];
  total: number;
  week: number;
  month: number;
};

export default function EarningsGraph({ data, total, week, month }: EarningsGraphProps) {
  const theme = useTokens();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { color: theme.text }]}>Earnings</Text>
      <View style={[styles.card, { borderColor: theme.border }]}>
        <EarningsChart data={data} total={total} week={week} month={month} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  card: {
    backgroundColor: 'rgba(15,15,20,0.8)',
    borderRadius: 24,
    padding: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.25)',
    // @ts-expect-error web-only blur support
    backdropFilter: 'blur(22px)',
    shadowColor: '#3CF2FF',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
});
