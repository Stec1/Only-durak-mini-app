import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Platform, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '@/constants/tokens';
import { typography } from '@/constants/typography';
import SafeImage from './SafeImage';

type CapsuleProps = {
  label: string;
  avatar?: React.ReactNode;
  avatarSource?: ImageSourcePropType;
  style?: ViewStyle;
};

export default function Capsule({ label, avatar, avatarSource, style }: CapsuleProps) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[colors.surface, colors.surface2] as const}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {avatarSource ? (
          <SafeImage
            source={avatarSource}
            fallbackType="avatar"
            style={styles.avatar}
          />
        ) : avatar ? (
          <View style={styles.avatar}>{avatar}</View>
        ) : null}
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  label: {
    ...typography.body,
  },
});
