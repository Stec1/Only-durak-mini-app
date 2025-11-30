import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, Moon, Sun } from 'lucide-react-native';

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

function withAlpha(color: string, alpha: number) {
  if (color.startsWith('#')) {
    const normalized = color.replace('#', '');
    const bigint = parseInt(normalized.length === 3 ? normalized.repeat(2) : normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (color.startsWith('rgb')) {
    const parts = color
      .replace(/rgba?\(/, '')
      .replace(')', '')
      .split(',')
      .map((part) => Number(part.trim()))
      .slice(0, 3);
    const [r, g, b] = parts;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
}

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
  const settingsAnim = useRef(new Animated.Value(0)).current;
  const panelWidth = useMemo(() => Math.min(Dimensions.get('window').width * 0.68, 280), []);

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
    Animated.timing(settingsAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
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

  const drawerTranslate = useMemo(
    () =>
      settingsAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [panelWidth, 0],
      }),
    [panelWidth, settingsAnim]
  );

  const overlayOpacity = useMemo(
    () =>
      settingsAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    [settingsAnim]
  );

  const handleToggleTheme = useCallback(() => {
    const nextTheme = themeName === 'dark' ? 'white' : 'dark';
    setTheme(nextTheme);
  }, [setTheme, themeName]);

  const closeSettings = useCallback(() => {
    Animated.timing(settingsAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setSettingsVisible(false);
      }
    });
  }, [settingsAnim]);

  const handleLogout = useCallback(() => {
    closeSettings();
    logout();
  }, [closeSettings, logout]);

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
            onDecksChanged={loadDecks}
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

      <Modal transparent visible={settingsVisible} animationType="fade" onRequestClose={closeSettings}>
        <View style={styles.drawerOverlay}>
          <Animated.View
            pointerEvents={settingsVisible ? 'auto' : 'none'}
            style={[
              StyleSheet.absoluteFillObject,
              styles.backdrop,
              { backgroundColor: withAlpha(themeTokens.bg, 0.55), opacity: overlayOpacity },
            ]}
          >
            <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={closeSettings} />
          </Animated.View>

          <Animated.View
            style={[
              styles.drawer,
              {
                width: panelWidth,
                backgroundColor: withAlpha(themeTokens.cardBg, 0.9),
                borderColor: withAlpha(themeTokens.border, 0.8),
                shadowColor: themeTokens.cardShadow.shadowColor,
                transform: [{ translateX: drawerTranslate }],
              },
            ]}
          >
            <View style={styles.drawerHeader}>
              <Text style={[styles.drawerTitle, { color: themeTokens.text }]}>Settings</Text>
              <TouchableOpacity onPress={closeSettings} hitSlop={8}>
                <View style={[styles.iconPill, { backgroundColor: withAlpha(themeTokens.border, 0.4) }]}>
                  <Text style={{ color: themeTokens.text, fontSize: 16 }}>×</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.settingRow, { borderColor: themeTokens.border }]}> 
              <View style={styles.settingLabelRow}>
                <Sun color={themeTokens.text} size={18} />
                <Text style={[styles.settingLabel, { color: themeTokens.text }]}>Theme</Text>
              </View>
              <View style={styles.switchWrap}>
                <Sun color={themeTokens.subtext} size={16} />
                <Switch
                  value={themeName !== 'dark'}
                  onValueChange={handleToggleTheme}
                  trackColor={{ false: withAlpha(themeTokens.border, 0.7), true: withAlpha(themeTokens.accent, 0.3) }}
                  thumbColor={themeTokens.cardBg}
                />
                <Moon color={themeTokens.subtext} size={16} />
              </View>
            </View>

            <TouchableOpacity style={styles.settingRow} activeOpacity={0.8} onPress={handleLogout}>
              <View style={styles.settingLabelRow}>
                <LogOut color={themeTokens.accent} size={18} />
                <Text style={[styles.settingLabel, { color: themeTokens.accent }]}>Log out</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
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
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  drawer: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    paddingTop: 40,
    gap: tokens.spacing.lg,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  iconPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  switchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
});
