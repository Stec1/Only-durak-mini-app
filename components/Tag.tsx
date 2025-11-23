import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/constants/tokens';
import { typography } from '@/constants/typography';

type TagProps = {
  label: string;
  style?: ViewStyle;
};

export default function Tag({ label, style }: TagProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  label: {
    ...typography.meta,
    fontSize: 11,
  },
});
