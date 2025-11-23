import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/src/theme/tokens';
import { Info } from 'lucide-react-native';
import Screen from '@/src/components/ui/Screen';

export default function QuickPlay() {
  const router = useRouter();

  return (
    <Screen style={styles.content}>
        {Platform.OS === 'web' && (
          <View style={styles.infoBanner}>
            <Info color="#19E3E3" size={20} strokeWidth={2.5} />
            <Text style={styles.infoText}>
              Multiplayer disabled on Web preview
            </Text>
          </View>
        )}

        <Text style={styles.title}>Quick Play</Text>
        <Text style={styles.description}>
          Join the first available room or create a new one automatically.
        </Text>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.btnPrimary}
            onPress={() => router.push('/game/room' as any)}
          >
            <Text style={styles.btnPrimaryText}>Find Game</Text>
          </Pressable>

          <Pressable
            style={styles.btnOutline}
            onPress={() => router.back()}
          >
            <Text style={styles.btnOutlineText}>Back</Text>
          </Pressable>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: tokens.spacing.lg,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    backgroundColor: 'rgba(25, 227, 227, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(25, 227, 227, 0.3)',
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  infoText: {
    flex: 1,
    color: '#19E3E3',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  title: {
    ...tokens.typography.h1,
    color: tokens.text.primary,
    marginBottom: tokens.spacing.md,
  },
  description: {
    ...tokens.typography.body,
    color: 'rgba(230, 231, 235, 0.7)',
    lineHeight: 22,
    marginBottom: tokens.spacing.xl,
  },
  buttonsContainer: {
    gap: tokens.spacing.md,
  },
  btnPrimary: {
    height: 54,
    borderRadius: 999,
    backgroundColor: '#19E3E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  btnOutline: {
    height: 54,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#19E3E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    color: '#19E3E3',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
