import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';
import { useAuth } from '@/contexts/auth';
import { loadDeck, saveDeck, DECK_KEYS, type DeckMap } from '@/utils/deck';
import { getDecks } from '@/storage/decks';
import type { Deck } from '@/types/deck';
import { mockRecent } from '@/src/data/profileMocks';

import HeaderSection from './components/HeaderSection';
import FeatureHub from './components/FeatureHub';
import MyDeckPreview from './components/MyDeckPreview';
import DeckConstructorBlock from './components/DeckConstructorBlock';
import JokerSlots from './components/JokerSlots';
import RecentMatches from './components/RecentMatches';

const DRAFT_DECK_KEY = 'DECK_CONSTRUCTOR_DRAFT_V1';

async function loadDraftDeck(): Promise<DeckMap | null> {
  const raw = await AsyncStorage.getItem(DRAFT_DECK_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DeckMap;
  } catch {
    return null;
  }
}

export default function ProfileScreen() {
  const { user, role, logout } = useAuth();
  const { themeName, setTheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const themeTokens = useTokens();
  const scrollRef = useRef<ScrollView>(null);

  const isModel = role === 'model';
  const displayName = user?.name || 'Player';
  const roleBadgeLabel = `${role === 'model' ? 'Model' : role === 'fan' ? 'Fan' : 'Guest'} account`;
  const userIdForDeck = user?.id || 'Model';

  const [deck, setDeck] = useState<DeckMap | null>(null);
  const [draftDeck, setDraftDeck] = useState<DeckMap | null>(null);
  const [deckProgress, setDeckProgress] = useState({ filled: 0, total: DECK_KEYS.length });
  const [decks, setDecks] = useState<Deck[]>([]);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleSettingsPress = () => {
    setSettingsVisible(true);
  };

  useEffect(() => {
    if (!user) {
      router.replace('/register');
    }
  }, [router, user]);

  const loadDecks = useCallback(async () => {
    const loadedDecks = await getDecks(userIdForDeck);
    setDecks(loadedDecks);
  }, [userIdForDeck]);

  const refreshDeckData = useCallback(async () => {
    if (role !== 'model') return;

    const loaded = await loadDeck();
    setDeck(loaded);
    const filled = Object.values(loaded).filter((uri) => uri !== null).length;
    setDeckProgress({ filled, total: DECK_KEYS.length });

    await loadDecks();

    const draft = await loadDraftDeck();
    setDraftDeck(draft);
  }, [loadDecks, role]);

  useEffect(() => {
    refreshDeckData();
  }, [refreshDeckData]);

  useFocusEffect(
    useCallback(() => {
      refreshDeckData();
    }, [refreshDeckData])
  );

  const handleResetDeck = () => {
    Alert.alert(
      'Reset Deck',
      'Are you sure you want to reset your custom deck? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const emptyDeck = Object.fromEntries(DECK_KEYS.map((k) => [k, null])) as DeckMap;
            await saveDeck(emptyDeck);
            setDeck(emptyDeck);
            setDeckProgress({ filled: 0, total: DECK_KEYS.length });
            Alert.alert('Success', 'Your deck has been reset.');
          },
        },
      ]
    );
  };

  const glassSpacing = useMemo(
    () => ({ paddingTop: insets.top + tokens.spacing.xl, paddingBottom: insets.bottom + tokens.spacing['2xl'] }),
    [insets.bottom, insets.top]
  );

  const handleToggleTheme = useCallback(() => {
    const nextTheme = themeName === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setSettingsVisible(false);
  }, [setTheme, themeName]);

  const handleLogout = useCallback(() => {
    setSettingsVisible(false);
    logout();
  }, [logout]);

  const closeSettings = () => setSettingsVisible(false);

  const themeToggleLabel = themeName === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme';

  return (
    <View style={[styles.container, { backgroundColor: themeTokens.bg }]}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, glassSpacing]}
        showsVerticalScrollIndicator={false}
      >
        <HeaderSection
          displayName={displayName}
          subtitle={roleBadgeLabel}
          avatarUri={avatarUri}
          onAvatarChange={setAvatarUri}
          onSettingsPress={handleSettingsPress}
        />

        <FeatureHub
          onOpenMarketplace={() => router.push('/marketplace/marketplace')}
          onOpenGames={() => router.push('/(tabs)/game')}
        />

        {isModel && (
          <MyDeckPreview
            decks={decks}
            deckProgress={deckProgress}
            onOpenDeck={(deckId) => router.push(`/decks/${deckId}` as const)}
            onResetDeck={handleResetDeck}
          />
        )}

        {isModel && (
          <DeckConstructorBlock
            deckMap={draftDeck || deck}
            totalSlots={DECK_KEYS.length}
            onOpenConstructor={() => router.push('/deck-constructor')}
          />
        )}

        <JokerSlots />

        <RecentMatches matches={mockRecent} />
      </ScrollView>

      <Modal transparent visible={settingsVisible} animationType="slide" onRequestClose={closeSettings}>
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeSettings} />
          <View style={[styles.sheet, { backgroundColor: themeTokens.cardBg, borderColor: themeTokens.border }]}>
            <TouchableOpacity style={styles.sheetItem} activeOpacity={0.75} onPress={handleToggleTheme}>
              <Text style={[styles.sheetText, { color: themeTokens.text }]}>{themeToggleLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem} activeOpacity={0.75} onPress={handleLogout}>
              <Text style={[styles.sheetText, styles.destructive, { color: themeTokens.text }]}>Log out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem} activeOpacity={0.75} onPress={closeSettings}>
              <Text style={[styles.sheetText, { color: themeTokens.subtext }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
    gap: tokens.spacing.lg,
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderWidth: 1,
    gap: tokens.spacing.xs,
  },
  sheetItem: {
    paddingVertical: tokens.spacing.md,
  },
  sheetText: {
    fontSize: 16,
    fontWeight: '700',
  },
  destructive: {
    color: '#FF7B7B',
  },
});
