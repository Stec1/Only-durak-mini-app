import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/tokens';
import { typography } from '@/constants/typography';

type StatTileProps = {
  value: string | number;
  label: string;
  Icon: LucideIcon;
  iconColor?: string;
  style?: ViewStyle;
};

export default function StatTile({ value, label, Icon, iconColor = colors.primary, style }: StatTileProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrapper}>
        <Icon color={iconColor} size={24} strokeWidth={2.5} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    alignItems: 'center',
    minWidth: 100,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  iconWrapper: {
    marginBottom: spacing.sm,
  },
  value: {
    ...typography.number,
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    ...typography.meta,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
