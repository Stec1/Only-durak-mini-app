import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { tokens } from '@/src/theme/tokens';

type StatCardProps = {
  value: string | number;
  caption: string;
  onPress?: () => void;
};

export default function StatCard({ value, caption, onPress }: StatCardProps) {
  const [pressed, setPressed] = React.useState(false);

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 104,
    minHeight: 94,
    backgroundColor: tokens.card.bg,
    borderRadius: tokens.card.radius,
    borderWidth: 1,
    borderColor: tokens.card.border,
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: tokens.card.shadow.color,
    shadowOffset: tokens.card.shadow.offset,
    shadowOpacity: tokens.card.shadow.opacity,
    shadowRadius: tokens.card.shadow.radius,
    elevation: 6,
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
