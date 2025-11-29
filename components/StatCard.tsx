import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { tokens } from '@/src/theme/tokens';
import { useTokens } from '@/src/contexts/theme';

type StatCardProps = {
  value: string | number;
  caption: string;
  onPress?: () => void;
};

export default function StatCard({ value, caption, onPress }: StatCardProps) {
  const [pressed, setPressed] = React.useState(false);
  const themeTokens = useTokens();

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.container,
        {
          backgroundColor: themeTokens.cardBg,
          borderColor: themeTokens.border,
          shadowColor: themeTokens.cardShadow.shadowColor,
          shadowOpacity: themeTokens.cardShadow.shadowOpacity,
          shadowRadius: themeTokens.cardShadow.shadowRadius,
          shadowOffset: themeTokens.cardShadow.shadowOffset,
          elevation: themeTokens.cardShadow.elevation,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.value, { color: themeTokens.text }]}>{value}</Text>
      <Text style={[styles.caption, { color: themeTokens.subtext }]}>{caption}</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 104,
    minHeight: 94,
    borderRadius: tokens.card.radius,
    borderWidth: 1,
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  pressed: {
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    transform: [{ scale: 0.98 }],
  },
  value: {
    color: tokens.text.primary,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
    textAlign: 'center',
  },
  caption: {
    color: tokens.text.secondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
