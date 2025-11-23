import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/src/theme/tokens';
import { Info, User } from 'lucide-react-native';
import Screen from '@/src/components/ui/Screen';

const mockPlayers = [
  { id: '1', name: 'Player 1', status: 'ready', seat: 0 },
  { id: '2', name: 'Player 2', status: 'waiting', seat: 1 },
  null,
  null,
];

export default function RoomLobby() {
  const router = useRouter();

  const handleReady = () => {
    console.log('Player ready');
  };

  const handleStart = () => {
    console.log('Starting game');
    router.push('/game/board' as any);
  };

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

        <Text style={styles.roomInfo}>
          Room ID: DEMO123 • Public
        </Text>

        <ScrollView 
          style={styles.playersList}
          contentContainerStyle={styles.playersListContent}
          showsVerticalScrollIndicator={false}
        >
          {mockPlayers.map((player, index) => (
            <View key={index} style={styles.playerCard}>
              <View style={styles.playerAvatar}>
                <User color="rgba(230, 231, 235, 0.5)" size={24} strokeWidth={2.5} />
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>
                  {player ? player.name : `Seat ${index + 1}`}
                </Text>
                <Text style={styles.playerStatus}>
                  {player ? player.status : 'empty'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.buttonsContainer}>
          <Pressable style={styles.btnPrimary} onPress={handleReady}>
            <Text style={styles.btnPrimaryText}>I'm Ready</Text>
          </Pressable>

          <Pressable style={styles.btnOutline} onPress={handleStart}>
            <Text style={styles.btnOutlineText}>Start Game (Host)</Text>
          </Pressable>

          <Pressable
            style={styles.btnOutline}
            onPress={() => router.back()}
          >
            <Text style={styles.btnOutlineText}>Leave Room</Text>
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
  roomInfo: {
    ...tokens.typography.body,
    color: 'rgba(230, 231, 235, 0.7)',
    marginBottom: tokens.spacing.xl,
  },
  playersList: {
    flex: 1,
  },
  playersListContent: {
    gap: tokens.spacing.md,
    paddingBottom: tokens.spacing.lg,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#241F28',
    borderRadius: tokens.borderRadius.xl,
    padding: tokens.spacing.lg,
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2f2a33',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    ...tokens.typography.h4,
    color: tokens.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  playerStatus: {
    ...tokens.typography.caption,
    color: 'rgba(230, 231, 235, 0.6)',
  },
  buttonsContainer: {
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
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
