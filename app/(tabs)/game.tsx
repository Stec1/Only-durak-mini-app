import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/src/state/gameStore';
import type { RoomSummary } from '@/src/game/types';
import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';

function PrimaryBtn({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.btnPrimary}>
      <Text style={styles.btnPrimaryText}>{title}</Text>
    </Pressable>
  );
}

function OutlineBtn({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.btnOutline}>
      <Text style={styles.btnOutlineText}>{title}</Text>
    </Pressable>
  );
}

function RoomItem({ item, onJoin }: { item: RoomSummary; onJoin: () => void }) {
  const playersText = `${item.players}/${item.maxPlayers}`;
  const typeText = item.isPrivate ? 'Private' : 'Public';
  const deckText = `${item.settings.deckSize} cards`;

  return (
    <Pressable style={styles.roomCard}>
      <Text style={styles.roomName}>{item.name}</Text>
      <Text style={styles.roomDetails}>
        {playersText} • {deckText} • {typeText}
      </Text>
      <View style={styles.roomBtnContainer}>
        <OutlineBtn title="Join" onPress={onJoin} />
      </View>
    </Pressable>
  );
}

export default function GameTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const themeTokens = useTokens();
  const styles = useMemo(() => createStyles(themeTokens), [themeTokens]);
  const { rooms, myRoom, phase, actions } = useGameStore();

  useEffect(() => {
    actions.connect();
    actions.listRooms();
  }, [actions]);

  useEffect(() => {
    if (myRoom && phase === 'lobby') router.push('/game/room' as any);
    if (myRoom && phase && phase !== 'lobby') router.push('/game/board' as any);
  }, [myRoom, phase, router]);

  return (
    <View style={[styles.container, { backgroundColor: themeTokens.bg }]}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + tokens.spacing.xl,
            paddingBottom: insets.bottom + tokens.spacing.md,
          },
        ]}
      >
        <Text style={styles.title}>Game Table</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Create a room as a Model or join a Model room as a Fan.
          </Text>
        </View>

        <View style={styles.actionsBlock}>
          <PrimaryBtn title="Quick Play" onPress={() => router.push('/game/quick' as any)} />
          <OutlineBtn title="Create Room" onPress={() => router.push('/game/create' as any)} />
          <OutlineBtn title="Join by Code" onPress={() => router.push('/game/join' as any)} />
        </View>

        <Text style={styles.sectionTitle}>Active Rooms</Text>

        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RoomItem
              item={item}
              onJoin={() => useGameStore.getState().actions.joinRoom(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No rooms yet.</Text>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const createStyles = (themeTokens: ReturnType<typeof useTokens>) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.spacing.lg,
  },
  title: {
    ...tokens.typography.h1,
    color: themeTokens.text,
    marginBottom: tokens.spacing.xl,
  },
  infoCard: {
    backgroundColor: themeTokens.cardBg,
    borderRadius: tokens.borderRadius.xl,
    padding: tokens.spacing.xl,
    marginBottom: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: themeTokens.border,
  },
  infoText: {
    ...tokens.typography.body,
    color: themeTokens.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionsBlock: {
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing['2xl'],
  },
  btnPrimary: {
    height: 54,
    borderRadius: 999,
    backgroundColor: themeTokens.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.md,
  },
  btnPrimaryText: {
    color: themeTokens.bg,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  btnOutline: {
    height: 54,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: themeTokens.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.sm,
  },
  btnOutlineText: {
    color: themeTokens.accent,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  sectionTitle: {
    ...tokens.typography.h4,
    color: themeTokens.text,
    fontWeight: '600' as const,
    marginBottom: tokens.spacing.md,
  },
  listContent: {
    flexGrow: 1,
  },
  roomCard: {
    backgroundColor: themeTokens.cardBg,
    borderRadius: tokens.borderRadius.xl,
    padding: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
    borderWidth: 1,
    borderColor: themeTokens.border,
  },
  roomName: {
    ...tokens.typography.h4,
    color: themeTokens.text,
    fontWeight: '600' as const,
    marginBottom: tokens.spacing.xs,
  },
  roomDetails: {
    ...tokens.typography.caption,
    color: themeTokens.subtext,
    marginBottom: tokens.spacing.md,
  },
  roomBtnContainer: {
    marginTop: tokens.spacing.xs,
  },
  emptyText: {
    ...tokens.typography.body,
    color: themeTokens.subtext,
    textAlign: 'center',
    marginTop: tokens.spacing.xl,
  },
});
