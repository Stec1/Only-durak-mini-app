import React, { useState } from 'react';
import {
  Alert,
  GestureResponderEvent,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Settings } from 'lucide-react-native';

import { tokens } from '@/src/theme/tokens';
import { useTokens } from '@/src/contexts/theme';
import { Deck } from '@/types/deck';
import { deleteDeck, saveDeck } from '@/storage/decks';

interface MyDeckPreviewProps {
  decks: Deck[];
  deckProgress: { filled: number; total: number };
  onOpenDeck: (deckId: string) => void;
  onDecksChanged?: () => Promise<void> | void;
}
const applyAlpha = (color: string, alpha: number) => {
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
};

export default function MyDeckPreview({ decks, deckProgress: _deckProgress, onOpenDeck, onDecksChanged }: MyDeckPreviewProps) {
  const theme = useTokens();
  const isDark = theme.isDark;
  const hasDecks = decks.length > 0;
  const [menuDeck, setMenuDeck] = useState<Deck | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [renameValue, setRenameValue] = useState('');
  const [renameTarget, setRenameTarget] = useState<Deck | null>(null);

  const closeMenu = () => setMenuDeck(null);

  const handleSettingsPress = (deck: Deck, event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    setMenuDeck(deck);
  };

  const handleRenamePress = (deck: Deck) => {
    setRenameTarget(deck);
    setRenameValue(deck.name);
    closeMenu();
  };

  const handleDeletePress = async (deck: Deck) => {
    try {
      await deleteDeck(deck.ownerModelId, deck.id);
      await onDecksChanged?.();
    } catch (err) {
      Alert.alert('Unable to delete', 'Something went wrong while deleting this deck.');
      console.error('delete deck error', err);
    } finally {
      closeMenu();
    }
  };

  const handleConfirmRename = async () => {
    if (!renameTarget) return;
    const trimmed = renameValue.trim();
    if (!trimmed) {
      Alert.alert('Name required', 'Please enter a name for your deck.');
      return;
    }

    try {
      await saveDeck(renameTarget.ownerModelId, { ...renameTarget, name: trimmed });
      await onDecksChanged?.();
    } catch (err) {
      Alert.alert('Unable to rename', 'Something went wrong while renaming this deck.');
      console.error('rename deck error', err);
    } finally {
      setRenameTarget(null);
    }
  };

  const closeRenameDialog = () => {
    setRenameTarget(null);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>My Deck</Text>
        </View>
      </View>

      {hasDecks ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.deckList}
        >
          {decks.map((deck) => (
            <View
              key={deck.id}
              style={[
                styles.deckCard,
                {
                  backgroundColor: isDark ? applyAlpha(theme.cardBg, 0.9) : theme.surfaceElevated,
                  borderColor: isDark ? theme.border : theme.borderSubtle,
                  shadowColor: isDark ? '#3CF2FF' : theme.cardShadow.shadowColor,
                  shadowOpacity: isDark ? 0.22 : theme.cardShadow.shadowOpacity,
                  shadowRadius: isDark ? 12 : theme.cardShadow.shadowRadius,
                  shadowOffset: isDark ? { width: 0, height: 8 } : theme.cardShadow.shadowOffset,
                  elevation: isDark ? 5 : theme.cardShadow.elevation,
                },
              ]}
            >
              <TouchableOpacity activeOpacity={0.85} onPress={() => onOpenDeck(deck.id)}>
                <ImageBackground
                  source={{ uri: deck.backUri }}
                  style={styles.deckImage}
                  imageStyle={styles.deckImageRadius}
                >
                  <View
                    style={[
                      styles.deckOverlay,
                      { backgroundColor: isDark ? applyAlpha(theme.bg, 0.35) : applyAlpha(theme.bg, 0.08) },
                    ]}
                  />
                  <Text style={[styles.deckName, { color: theme.text }]}>{deck.name}</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deckSettings, { backgroundColor: applyAlpha(theme.border, 0.6) }]}
                hitSlop={8}
                onPress={(event) => handleSettingsPress(deck, event)}
              >
                <Settings size={18} color={theme.text} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.empty,
            {
              borderColor: isDark ? theme.border : theme.borderSubtle,
              backgroundColor: isDark ? applyAlpha(theme.cardBg, 0.9) : theme.surfaceElevated,
              shadowColor: isDark ? '#3CF2FF' : theme.cardShadow.shadowColor,
              shadowOpacity: isDark ? 0.18 : theme.cardShadow.shadowOpacity,
              shadowRadius: isDark ? 10 : theme.cardShadow.shadowRadius,
              shadowOffset: isDark ? { width: 0, height: 6 } : theme.cardShadow.shadowOffset,
              elevation: isDark ? 4 : theme.cardShadow.elevation,
            },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No decks yet</Text>
          <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>Create a deck to preview it here.</Text>
        </View>
      )}

      <Modal transparent visible={!!menuDeck} animationType="fade" onRequestClose={closeMenu}>
        <View style={styles.menuOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={closeMenu} />
          {menuDeck && (
            <View
              style={[
                styles.contextMenu,
                {
                  top: Math.max(menuPosition.y - 10, 10),
                  left: Math.max(menuPosition.x - 190, tokens.spacing.md),
                  backgroundColor: isDark ? applyAlpha(theme.cardBg, 0.92) : theme.surfaceElevated,
                  borderColor: isDark ? applyAlpha(theme.border, 0.8) : theme.borderSubtle,
                  shadowColor: theme.cardShadow.shadowColor,
                  shadowOpacity: isDark ? theme.cardShadow.shadowOpacity : theme.cardShadow.shadowOpacity,
                  shadowRadius: theme.cardShadow.shadowRadius,
                  shadowOffset: theme.cardShadow.shadowOffset,
                  elevation: theme.cardShadow.elevation,
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.menuItem, { borderColor: isDark ? applyAlpha(theme.border, 0.7) : theme.borderSubtle }]}
                onPress={() => handleRenamePress(menuDeck)}
              >
                <Text style={[styles.menuText, { color: theme.text }]}>Rename Deck</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleDeletePress(menuDeck)}>
                <Text style={[styles.menuText, { color: theme.accent }]}>Delete Deck</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                <Text style={[styles.menuText, { color: theme.subtext }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      <Modal transparent visible={!!renameTarget} animationType="fade" onRequestClose={closeRenameDialog}>
        <View style={styles.renameOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={closeRenameDialog} />
          <View
            style={[
              styles.renameCard,
              {
                backgroundColor: isDark ? applyAlpha(theme.cardBg, 0.95) : theme.surfaceElevated,
                borderColor: isDark ? applyAlpha(theme.border, 0.9) : theme.borderSubtle,
                shadowColor: theme.cardShadow.shadowColor,
              },
            ]}
          >
            <Text style={[styles.renameTitle, { color: theme.text }]}>Rename Deck</Text>
            <TextInput
              value={renameValue}
              onChangeText={setRenameValue}
              placeholder="Enter deck name"
              placeholderTextColor={applyAlpha(theme.subtext, 0.7)}
              style={[styles.input, { color: theme.text, borderColor: applyAlpha(theme.border, 0.8) }]}
              autoFocus
            />
            <View style={styles.renameActions}>
              <TouchableOpacity style={styles.renameButton} onPress={closeRenameDialog}>
                <Text style={[styles.menuText, { color: theme.subtext }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.renameButton} onPress={handleConfirmRename}>
                <Text style={[styles.menuText, { color: theme.accent }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: tokens.spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  deckList: {
    paddingVertical: tokens.spacing.sm,
    paddingRight: tokens.spacing.xs,
    paddingLeft: tokens.spacing.xs,
  },
  deckCard: {
    width: 180,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: tokens.spacing.md,
  },
  deckImage: {
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  deckImageRadius: {
    borderRadius: 18,
  },
  deckOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  deckName: {
    fontSize: 16,
    fontWeight: '800',
    padding: tokens.spacing.md,
  },
  deckSettings: {
    position: 'absolute',
    top: tokens.spacing.sm,
    right: tokens.spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  empty: {
    borderWidth: 1,
    borderRadius: 18,
    padding: tokens.spacing.lg,
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  menuOverlay: {
    flex: 1,
  },
  contextMenu: {
    position: 'absolute',
    width: 180,
    borderRadius: 14,
    paddingVertical: tokens.spacing.xs,
    borderWidth: 1,
    gap: 4,
  },
  menuItem: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderColor: 'transparent',
  },
  menuText: {
    fontSize: 15,
    fontWeight: '700',
  },
  renameOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  renameCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: tokens.spacing.lg,
    borderWidth: 1,
    gap: tokens.spacing.md,
  },
  renameTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    fontSize: 15,
    fontWeight: '700',
  },
  renameActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: tokens.spacing.md,
  },
  renameButton: {
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.sm,
  },
});
