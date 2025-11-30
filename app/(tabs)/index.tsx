import { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, Modal, Pressable, FlatList, Alert, TextInput } from "react-native";
import * as Haptics from 'expo-haptics';
import { Users, LogOut, Settings, ChevronRight, RotateCcw, Trophy, TrendingUp, Flame, Lightbulb } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/auth';
import { useTokens } from '@/src/contexts/theme';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { loadDeck, saveDeck, DECK_KEYS, type DeckMap } from '@/utils/deck';
import { getDecks, saveDeck as updateDeck, deleteDeck } from '@/storage/decks';
import { Deck } from '@/types/deck';
import { DeckThumb } from '@/components/DeckThumb';
import { DeckConstructorPreviewCard } from '@/components/DeckConstructorPreviewCard';
import { tokens } from '@/src/theme/tokens';
import { colors, spacing, radius } from '@/constants/tokens';
import { typography } from '@/constants/typography';

import Capsule from '@/components/Capsule';
import GlassCard from '@/components/GlassCard';
import Divider from '@/components/Divider';
import ProfileAvatar from '@/components/ProfileAvatar';
import StatCard from '@/components/StatCard';
import StatsAccordion from '@/src/components/profile/StatsAccordion';
import EarningsChart from '@/src/components/profile/EarningsChart';
import JokersPanel from '@/src/components/profile/JokersPanel';
import GamesStatsPanel from '@/src/components/profile/GamesStatsPanel';
import { mockEarnings, mockSummary, mockRecent, mockJokers } from '@/src/data/profileMocks';
import ThemePickerSheet from '@/src/components/ThemePickerSheet';





export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const themeTokens = useTokens();
  const styles = useMemo(() => createStyles(themeTokens), [themeTokens]);
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const isModel = role === 'model';
  const displayName = user?.name || 'Player';
  const roleLabel = role === 'model' ? 'Model' : role === 'fan' ? 'Fan' : 'Guest';
  const roleBadgeLabel = `${roleLabel} account`;
  const userIdForDeck = user?.id || 'Model';
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [deck, setDeck] = useState<DeckMap | null>(null);
  const [deckProgress, setDeckProgress] = useState({ filled: 0, total: DECK_KEYS.length });
  const [decks, setDecks] = useState<Deck[]>([]);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<'games' | 'earnings' | 'jokers' | null>(null);
  const [showThemePicker, setShowThemePicker] = useState(false);

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
  }, [role, loadDecks]);

  useEffect(() => {
    refreshDeckData();
  }, [refreshDeckData]);

  useFocusEffect(
    useCallback(() => {
      refreshDeckData();
    }, [refreshDeckData])
  );

  const handleLogout = async () => {
    setShowSettingsSheet(false);
    await logout();
    router.replace('/register');
  };

  const settingsCardBgWithOpacity = themeTokens.cardBg + 'F0';

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
            const emptyDeck = Object.fromEntries(DECK_KEYS.map(k => [k, null])) as DeckMap;
            await saveDeck(emptyDeck);
            setDeck(emptyDeck);
            setDeckProgress({ filled: 0, total: DECK_KEYS.length });
            Alert.alert('Success', 'Your deck has been reset.');
          },
        },
      ]
    );
  };

  const handleBadgePress = (section: 'games' | 'earnings' | 'jokers') => {
    setOpenAccordion((prev) => (prev === section ? null : section));
  };

  const handleDeckSettings = (deck: Deck) => {
    Alert.alert(
      'Deck Settings',
      deck.name,
      [
        {
          text: 'Rename',
          onPress: () => {
            setSelectedDeck(deck);
            setNewDeckName(deck.name);
            setRenameModalVisible(true);
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Deck',
              `Are you sure you want to delete "${deck.name}"? This cannot be undone.`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    await deleteDeck(userIdForDeck, deck.id);
                    await loadDecks();
                    Alert.alert('Success', 'Deck deleted successfully.');
                  },
                },
              ]
            );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRenameDeck = async () => {
    if (!selectedDeck || !newDeckName.trim()) return;

    const updatedDeckData: Deck = {
      ...selectedDeck,
      name: newDeckName.trim(),
      updatedAt: Date.now(),
    };

    await updateDeck(userIdForDeck, updatedDeckData);
    await loadDecks();
    setRenameModalVisible(false);
    setSelectedDeck(null);
    setNewDeckName('');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: themeTokens.bg }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + tokens.spacing.xl, paddingBottom: insets.bottom + tokens.spacing['2xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.settingsButtonContainer}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowSettingsSheet(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Settings color={themeTokens.subtext} size={24} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ProfileAvatar
            uri={avatarUri}
            onImagePicked={setAvatarUri}
            size={144}
          />

          <Text style={styles.displayName}>{displayName}</Text>
          <View style={styles.roleBadgeContainer}>
            <Capsule label={roleBadgeLabel} />
          </View>
          {isModel && (
            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statCard}
                activeOpacity={0.7}
                onPress={() => handleBadgePress('games')}
              >
                <View style={styles.statContent}>
                  <View style={styles.statIcon}>
                    <Trophy color={themeTokens.accent} size={18} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.statLabel}>Games</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statCard}
                activeOpacity={0.7}
                onPress={() => handleBadgePress('earnings')}
              >
                <View style={styles.statContent}>
                  <View style={styles.statIcon}>
                    <TrendingUp color={themeTokens.accent} size={18} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.statLabel}>Earnings</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statCard}
                activeOpacity={0.7}
                onPress={() => handleBadgePress('jokers')}
              >
                <View style={styles.statContent}>
                  <View style={styles.statIcon}>
                    <Flame color={themeTokens.accent} size={18} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.statLabel}>Joker NFTs</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {isModel ? (
          openAccordion ? (
            <View style={styles.accordionsContainer}>
              <StatsAccordion
                title="Games Played"
                icon={<Trophy color={themeTokens.text} size={20} strokeWidth={2.5} />}
                isOpen={openAccordion === 'games'}
                showHeader={false}
              >
                <GamesStatsPanel summary={mockSummary} recent={mockRecent} />
              </StatsAccordion>

              <StatsAccordion
                title="Earnings"
                icon={<TrendingUp color={themeTokens.text} size={20} strokeWidth={2.5} />}
                isOpen={openAccordion === 'earnings'}
                showHeader={false}
              >
                <EarningsChart
                  data={mockEarnings.series}
                  total={mockEarnings.total}
                  week={mockEarnings.week}
                  month={mockEarnings.month}
                />
              </StatsAccordion>

              <StatsAccordion
                title="Joker NFTs"
                icon={<Flame color={themeTokens.text} size={20} strokeWidth={2.5} />}
                isOpen={openAccordion === 'jokers'}
                showHeader={false}
              >
                <JokersPanel
                  jokers={mockJokers}
                  onOpenCollection={() => {}}
                />
              </StatsAccordion>
            </View>
          ) : null
        ) : (
          <View style={styles.nonModelStatsRow}>
            <StatCard value={6} caption="GAMES PLAYED" />
            <StatCard value={120} caption="CREDITS" />
            <StatCard value={1} caption="NFTs WON" />
          </View>
        )}



        {isModel && (
          <>
            <Text style={styles.sectionTitle}>My Deck</Text>
            
            {decks.length > 0 ? (
              <FlatList
                data={decks}
                keyExtractor={(d) => d.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12 }}
                renderItem={({ item }) => (
                  <Pressable onPress={() => router.push(`/decks/${item.id}` as any)} key={item.id}>
                    <DeckThumb 
                      name={item.name} 
                      backUri={item.backUri}
                      onPressSettings={() => handleDeckSettings(item)}
                    />
                  </Pressable>
                )}
              />
            ) : (
              <GlassCard style={styles.deckCard}>
                <Text style={styles.deckHint}>No decks yet. Create your first deck!</Text>
              </GlassCard>
            )}

            <Divider style={styles.divider} />
          </>
        )}

        <Text style={styles.sectionTitle}>Actions</Text>

        {isModel ? (
          <>
            <Text style={styles.sectionLabel}>Open Deck Constructor</Text>
            <DeckConstructorPreviewCard />

            <GlassCard style={styles.actionCard}>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={async () => {
                  if (Platform.OS !== 'web') {
                    try {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    } catch {}
                  }
                  router.push('/game/create');
                }}
              >
                <View style={styles.actionContent}>
                  <View style={styles.actionLeft}>
                    <View style={styles.actionIconWrapper}>
                      <Users color={themeTokens.accent} size={24} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.actionTitle}>Create Game Room</Text>
                  </View>
                  <ChevronRight color={themeTokens.text} size={20} strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            </GlassCard>
          </>
        ) : (
          <>
            <GlassCard style={styles.actionCard}>
              <TouchableOpacity 
                style={styles.actionButton} 
                activeOpacity={0.7}
              >
                <View style={styles.actionContent}>
                  <View style={styles.actionLeft}>
                    <View style={styles.actionIconWrapper}>
                      <Users color={themeTokens.accent} size={24} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.actionTitle}>Join Model Room</Text>
                  </View>
                  <ChevronRight color={themeTokens.text} size={20} strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            </GlassCard>
          </>
        )}

        {isModel && deckProgress.filled > 0 && (
          <>
            <View style={{ height: spacing.md }} />
            <TouchableOpacity 
              style={styles.resetButton}
              activeOpacity={0.7}
              onPress={handleResetDeck}
            >
              <RotateCcw color={colors.danger} size={18} strokeWidth={2.5} />
              <Text style={styles.resetText}>Reset Deck</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.footerHint}>
          <Text style={styles.hintText}>
            Win exclusive Joker NFTs by playing with creators.
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showSettingsSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettingsSheet(false)}
      >
        <Pressable 
          style={styles.sheetBackdrop}
          onPress={() => setShowSettingsSheet(false)}
        >
          <View style={[styles.sheetContainer, { paddingBottom: insets.bottom + tokens.spacing.lg }]}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={[styles.solidCardOverride, { backgroundColor: settingsCardBgWithOpacity, borderColor: themeTokens.border }]}>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>Settings</Text>
                </View>

                <Divider />

                <TouchableOpacity
                  style={styles.sheetOption}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowSettingsSheet(false);
                    setTimeout(() => {
                      setShowThemePicker(true);
                    }, 150);
                  }}
                >
                  <View style={[styles.themeIcon, { backgroundColor: themeTokens.cardBg, borderColor: themeTokens.border }]}>
                    <Lightbulb color={themeTokens.text} size={18} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.sheetOptionText}>Appearance</Text>
                </TouchableOpacity>

                <Divider />

                <TouchableOpacity
                  style={styles.sheetOption}
                  activeOpacity={0.7}
                  onPress={handleLogout}
                >
                  <LogOut color={colors.danger} size={24} strokeWidth={2.5} />
                  <Text style={[styles.sheetOptionText, { color: colors.danger }]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={renameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setRenameModalVisible(false)}
        >
          <View style={styles.renameModalContainer}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <GlassCard padding={tokens.spacing.lg}>
                <Text style={styles.modalTitle}>Rename Deck</Text>
                <TextInput
                  value={newDeckName}
                  onChangeText={setNewDeckName}
                  placeholder="Enter new name"
                  placeholderTextColor="#8A8F98"
                  style={styles.textInput}
                  autoFocus
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setRenameModalVisible(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSave]}
                    onPress={handleRenameDeck}
                    activeOpacity={0.7}
                    disabled={!newDeckName.trim()}
                  >
                    <Text style={[styles.modalButtonTextSave, !newDeckName.trim() && { opacity: 0.5 }]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </GlassCard>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <ThemePickerSheet
        visible={showThemePicker}
        onClose={() => setShowThemePicker(false)}
      />
    </View>
  );
}

const createStyles = (themeTokens: ReturnType<typeof useTokens>) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing['2xl'],
    position: 'relative',
  },
  settingsButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.card.radius,
    backgroundColor: themeTokens.cardBg,
    borderWidth: 1,
    borderColor: themeTokens.border,
  },
  displayName: {
    ...tokens.typography.h1,
    color: themeTokens.text,
    marginTop: tokens.spacing.lg,
    textAlign: 'center',
  },
  roleBadgeContainer: {
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: tokens.spacing.lg,
  },
  statCard: {
    flex: 1,
    height: 96,
    marginHorizontal: tokens.spacing.xs,
    backgroundColor: themeTokens.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: themeTokens.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: themeTokens.cardShadow.shadowColor,
    shadowOpacity: themeTokens.cardShadow.shadowOpacity,
    shadowRadius: themeTokens.cardShadow.shadowRadius,
    shadowOffset: themeTokens.cardShadow.shadowOffset,
    elevation: themeTokens.cardShadow.elevation,
  },
  statContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    marginBottom: tokens.spacing.xs,
  },
  statLabel: {
    ...tokens.typography.body,
    color: themeTokens.subtext,
  },
  nonModelStatsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.xl,
  },
  accordionsContainer: {
    marginBottom: tokens.spacing.xl,
  },
  divider: {
    marginVertical: tokens.spacing.xl,
  },
  sectionTitle: {
    ...tokens.typography.h2,
    color: themeTokens.text,
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  sectionLabel: {
    ...typography.meta,
    color: themeTokens.subtext,
    marginBottom: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.xs,
  },

  actionCard: {
    marginBottom: spacing.sm,
    padding: 0,
  },
  actionButton: {
    minHeight: 48,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  actionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: themeTokens.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    ...typography.subtitle,
    color: themeTokens.text,
  },
  footerHint: {
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  hintText: {
    ...typography.meta,
    textAlign: 'center',
    color: themeTokens.subtext,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    paddingHorizontal: spacing.lg,
  },
  sheetHeader: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sheetTitle: {
    ...typography.h2,
    color: themeTokens.text,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sheetOptionText: {
    ...typography.subtitle,
    flex: 1,
    color: themeTokens.text,
  },
  deckCard: {
    marginBottom: spacing.md,
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  deckTitle: {
    ...typography.subtitle,
    fontSize: 18,
    color: themeTokens.text,
  },
  progressBadge: {
    backgroundColor: themeTokens.cardBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: themeTokens.border,
  },
  progressText: {
    ...typography.meta,
    fontSize: 12,
    fontWeight: '700',
    color: themeTokens.text,
  },
  progressBarContainer: {
    marginBottom: spacing.md,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: themeTokens.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: themeTokens.accent,
    borderRadius: 4,
  },
  deckPreview: {
    marginTop: spacing.sm,
  },
  deckPreviewContent: {
    flexDirection: 'row',
    gap: 12,
  },
  miniCard: {
    width: 50,
    height: 70,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: themeTokens.cardBg,
    borderWidth: 1,
    borderColor: themeTokens.border,
  },
  miniCardImage: {
    width: '100%',
    height: '100%',
  },
  miniCardMore: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardMoreText: {
    ...typography.meta,
    fontSize: 14,
    fontWeight: '700',
    color: themeTokens.text,
  },
  deckHint: {
    ...typography.meta,
    textAlign: 'center',
    marginTop: spacing.xs,
    color: themeTokens.subtext,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: 'rgba(255, 77, 122, 0.05)',
  },
  resetText: {
    ...typography.subtitle,
    color: colors.danger,
    fontSize: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  renameModalContainer: {
    width: '86%',
    maxWidth: 400,
  },
  modalTitle: {
    ...typography.h2,
    fontSize: 20,
    marginBottom: spacing.md,
    color: themeTokens.text,
  },
  textInput: {
    borderWidth: 1,
    borderColor: themeTokens.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: themeTokens.text,
    fontSize: 16,
    backgroundColor: themeTokens.cardBg,
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  modalButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: 'transparent',
  },
  modalButtonSave: {
    backgroundColor: themeTokens.accent,
  },
  modalButtonTextCancel: {
    ...typography.subtitle,
    color: themeTokens.subtext,
    fontSize: 15,
  },
  modalButtonTextSave: {
    ...typography.subtitle,
    color: themeTokens.bg,
    fontSize: 15,
    fontWeight: '700' as const,
  },
  themeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  solidCardOverride: {
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
