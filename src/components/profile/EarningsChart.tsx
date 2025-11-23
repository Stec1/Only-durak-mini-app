import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { tokens } from '@/src/theme/tokens';

type DataPoint = {
  x: string;
  y: number;
};

type EarningsChartProps = {
  data: DataPoint[];
  total?: number;
  week?: number;
  month?: number;
};

export default function EarningsChart({ data, total, week, month }: EarningsChartProps) {
  const chartWidth = Dimensions.get('window').width - 64;
  const chartHeight = 160;
  const padding = { top: 20, bottom: 30, left: 20, right: 20 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const yRange = maxY - minY || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * innerWidth;
    const y = innerHeight - ((point.y - minY) / yRange) * innerHeight;
    return { x: x + padding.left, y: y + padding.top };
  });

  const pathData = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x},${point.y}`;
    }
    const prevPoint = points[index - 1];
    const cpX1 = prevPoint.x + (point.x - prevPoint.x) / 3;
    const cpX2 = prevPoint.x + (2 * (point.x - prevPoint.x)) / 3;
    return `${path} C ${cpX1},${prevPoint.y} ${cpX2},${point.y} ${point.x},${point.y}`;
  }, '');

  const areaPath = `${pathData} L ${points[points.length - 1].x},${chartHeight - padding.bottom} L ${points[0].x},${chartHeight - padding.bottom} Z`;

  return (
    <View style={styles.container}>
      {(total !== undefined || week !== undefined || month !== undefined) && (
        <View style={styles.kpiRow}>
          {total !== undefined && (
            <View style={styles.kpiItem}>
              <Text style={styles.kpiLabel}>Total</Text>
              <Text style={styles.kpiValue}>{total}</Text>
            </View>
          )}
          {week !== undefined && (
            <View style={styles.kpiItem}>
              <Text style={styles.kpiLabel}>7d</Text>
              <Text style={styles.kpiValue}>{week}</Text>
            </View>
          )}
          {month !== undefined && (
            <View style={styles.kpiItem}>
              <Text style={styles.kpiLabel}>30d</Text>
              <Text style={styles.kpiValue}>{month}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#3AFFFF" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#3AFFFF" stopOpacity="0.05" />
            </LinearGradient>
          </Defs>
          
          <Path
            d={areaPath}
            fill="url(#gradient)"
          />
          
          <Path
            d={pathData}
            stroke="#3AFFFF"
            strokeWidth={2.5}
            fill="none"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.md,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
  },
  kpiItem: {
    flex: 1,
  },
  kpiLabel: {
    color: tokens.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  kpiValue: {
    color: tokens.text.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  chartContainer: {
    marginHorizontal: -tokens.spacing.md,
    marginBottom: -tokens.spacing.sm,
  },
});
