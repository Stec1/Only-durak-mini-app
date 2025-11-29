import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Info, User } from 'lucide-react-native';
import GlassCard from '@/components/GlassCard';
import HoloButton from '@/components/HoloButton';
import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';

type Player = {
  id: string;
  name: string;
  status: 'ready' | 'waiting';
  seat: number;
};

const mockPlayers: (Player | null)[] = [
  { id: '1', name: 'Player 1', status: 'ready', seat: 0 },
  { id: '2', name: 'Player 2', status: 'waiting', seat: 1 },
  null,
  null,
];

export default function RoomLobby() {
  const router = useRouter();
  const params = useLocalSearchParams<{ roomId?: string; privacy?: string; host?: string; maxPlayers?: string }>();
  const themeTokens = useTokens();
  const styles = useMemo(() => createStyles(themeTokens), [themeTokens]);
  const insets = useSafeAreaInsets();

  const [players, setPlayers] = useState<(Player | null)[]>(mockPlayers);
  const [isReady, setIsReady] = useState(() => players[0]?.status === 'ready');

  const roomId = params.roomId || 'DEMO123';
  const privacyLabel = params.privacy || 'Public';
  const isHost = params.host !== 'false';
  const maxPlayers = Number(params.maxPlayers || players.length || 4);

  const activePlayers = players.filter(Boolean) as Player[];
  const readyCount = activePlayers.filter((player) => player.status === 'ready').length;
  const allPlayersReady = activePlayers.length > 0 && readyCount === activePlayers.length;

  const handleReady = useCallback(() => {
    setIsReady((prev) => {
      const next = !prev;
      setPlayers((current) =>
        current.map((player, index) =>
          index === 0 && player ? { ...player, status: next ? 'ready' : 'waiting' } : player
        )
      );
      console.log('Player ready state:', next);
      return next;
    });
  }, []);

  const handleStart = useCallback(() => {
    if (!isHost || !allPlayersReady) return;
    console.log('Starting game');
    router.push('/game/board' as any);
  }, [allPlayersReady, isHost, router]);

  const handleLeave = useCallback(() => {
    router.back();
  }, [router]);

  const readyFooterText = allPlayersReady
    ? 'All players are ready'
    : `${readyCount} / ${Math.max(activePlayers.length, maxPlayers)} players ready • Waiting for players…`;

  return (
    <View style={[styles.container, { backgroundColor: themeTokens.bg }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + tokens.spacing.lg,
              paddingBottom: insets.bottom + tokens.spacing['2xl'],
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Pressable onPress={handleLeave} style={styles.backButton} hitSlop={12}>
              <ChevronLeft color={themeTokens.text} size={20} strokeWidth={2.5} />
            </Pressable>
            <Text style={[styles.title, { color: themeTokens.text }]}>Lobby</Text>
            <View style={styles.backButton} />
          </View>

          {Platform.OS === 'web' && (
            <View style={[styles.infoBanner, { borderColor: themeTokens.border }]}>
              <Info color={themeTokens.accent} size={20} strokeWidth={2.5} />
              <Text style={[styles.infoText, { color: themeTokens.accent }]}>Multiplayer disabled on Web preview</Text>
            </View>
          )}

          <GlassCard padding={tokens.spacing.lg} style={styles.roomCard}>
            <Text style={[styles.metaLabel, { color: themeTokens.subtext }]}>ROOM ID</Text>
            <Text style={[styles.roomId, { color: themeTokens.text }]}>
              {roomId} · {privacyLabel}
            </Text>
            <Text style={[styles.roomMeta, { color: themeTokens.subtext }]}>1 Model · 2 Fans · 5 Games</Text>
          </GlassCard>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeTokens.text }]}>Players</Text>
            <Text style={[styles.sectionSubtitle, { color: themeTokens.subtext }]}>Seats available: {maxPlayers}</Text>
          </View>

          <View style={styles.playersList}>
            {players.map((player, index) => {
              const status = player ? player.status : 'empty';
              const statusColor =
                status === 'ready'
                  ? '#7AE0D6'
                  : status === 'waiting'
                    ? themeTokens.subtext
                    : 'rgba(255,255,255,0.3)';

              return (
                <GlassCard key={index} padding={tokens.spacing.md} style={styles.playerCard}>
                  <View style={styles.playerAvatar}>
                    <User color="rgba(230, 231, 235, 0.65)" size={22} strokeWidth={2.5} />
                  </View>
                  <View style={styles.playerInfo}>
                    <Text style={[styles.playerName, { color: themeTokens.text }]}>
                      {player ? player.name : `Seat ${index + 1}`}
                    </Text>
                    <Text style={[styles.playerStatus, { color: statusColor }]}>
                      {player ? status : 'empty'}
                    </Text>
                  </View>
                </GlassCard>
              );
            })}
          </View>

          <Text style={[styles.footerText, { color: themeTokens.subtext }]}>{readyFooterText}</Text>

          <View style={styles.buttonsContainer}>
            <HoloButton
              title={isReady ? 'Ready ✓' : "I'm Ready"}
              onPress={handleReady}
              style={[styles.primaryButton, isReady && styles.primaryButtonActive]}
            />

            <Pressable
              style={[
                styles.outlineButton,
                {
                  borderColor: themeTokens.accent,
                  opacity: isHost && allPlayersReady ? 1 : 0.5,
                },
              ]}
              onPress={handleStart}
              disabled={!isHost || !allPlayersReady}
            >
              <Text style={[styles.outlineText, { color: themeTokens.accent }]}>Start Game (Host)</Text>
            </Pressable>

            <Pressable
              style={[styles.outlineButton, { borderColor: themeTokens.border }]}
              onPress={handleLeave}
            >
              <Text style={[styles.outlineText, { color: '#FF6B7A' }]}>Leave Room</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (themeTokens: ReturnType<typeof useTokens>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      padding: tokens.spacing.lg,
      paddingBottom: tokens.spacing['2xl'],
      gap: tokens.spacing.lg,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...tokens.typography.h2,
    },
    infoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.md,
      backgroundColor: 'rgba(25, 227, 227, 0.08)',
      borderWidth: 1,
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.md,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500' as const,
    },
    roomCard: {
      gap: tokens.spacing.xs,
    },
    metaLabel: {
      ...tokens.typography.meta,
      letterSpacing: 1.2,
    },
    roomId: {
      ...tokens.typography.h2,
    },
    roomMeta: {
      ...tokens.typography.body,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: tokens.spacing.sm,
    },
    sectionTitle: {
      ...tokens.typography.h3,
    },
    sectionSubtitle: {
      ...tokens.typography.caption,
    },
    playersList: {
      gap: tokens.spacing.md,
    },
    playerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.md,
      backgroundColor: themeTokens.cardBg,
    },
    playerAvatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: 'rgba(255,255,255,0.04)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
    },
    playerInfo: {
      flex: 1,
      gap: tokens.spacing.xs,
    },
    playerName: {
      ...tokens.typography.h4,
    },
    playerStatus: {
      ...tokens.typography.caption,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    footerText: {
      ...tokens.typography.caption,
      textAlign: 'center',
    },
    buttonsContainer: {
      gap: tokens.spacing.md,
      marginTop: tokens.spacing.sm,
    },
    primaryButton: {
      width: '100%',
    },
    primaryButtonActive: {
      opacity: 0.85,
    },
    outlineButton: {
      width: '100%',
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.lg,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeTokens.cardBg,
    },
    outlineText: {
      ...tokens.typography.h4,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
  });
