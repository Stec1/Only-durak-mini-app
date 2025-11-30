import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Dimensions, Modal, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ODCard from '@/components/ODCard';
import { RANKS, SUITS, cardKey, type Rank, type Suit } from '@/utils/deck';
import { isModel, getUser } from '@/store/user';
import { saveDeck as saveNewDeck } from '@/storage/decks';
import { Deck, CardKey } from '@/types/deck';
import GlassCard from '@/components/GlassCard';
import { pickImageNoCrop } from '@/src/utils/imagePicker';
import { ensureDraftDeckPersistence, loadDraftDeckFromStorage, useDraftDeckActions, useDraftDeckStore } from '@/src/state/deckDraftStore';

function DeckSlot({ suit, rank, uri, onPick }: { suit: Suit; rank: Rank; uri?: string | null; onPick: () => void }) {
  const screenWidth = Dimensions.get('window').width;
  return (
    <Pressable onPress={onPick} style={{ alignItems: 'center' }}>
      <ODCard suit={suit} rank={rank} photoUri={uri} width={Math.min((screenWidth - 64) / 4, 86)} />
    </Pressable>
  );
}

export default function DeckConstructorScreen() {
  const [ready, setReady] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const deck = useDraftDeckStore((state) => state.deck);
  const deckName = useDraftDeckStore((state) => state.deckName);
  const backUri = useDraftDeckStore((state) => state.backUri);
  const actions = useDraftDeckActions();

  useEffect(() => {
    ensureDraftDeckPersistence();
    loadDraftDeckFromStorage();
  }, []);

  useEffect(() => {
    if (!isModel()) {
      Alert.alert('Access denied', 'Only models can edit a personal deck.');
      router.back();
      return;
    }
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    setRefresh((prev) => !prev);
  }, [deck]);

  const data = RANKS.flatMap((r) => SUITS.map((s) => ({ rank: r as Rank, suit: s as Suit, key: cardKey(r as Rank, s as Suit) })));

  const onPick = useCallback(async (rank: Rank, suit: Suit) => {
    if (!isModel()) return;
    try {
      const uri = await pickImageNoCrop();
      if (uri) {
        const k = cardKey(rank, suit);
        actions.setCardImage(k, uri);
      }
    } catch (e) {
      console.warn('Image pick cancelled:', e);
    }
  }, [actions]);

  const onSave = useCallback(() => {
    if (!isModel()) return;
    const filledCards = Object.entries(deck).filter(([_, uri]) => uri !== null);
    if (filledCards.length === 0) {
      Alert.alert('Empty Deck', 'Please add at least one card before saving.');
      return;
    }
    setShowSaveModal(true);
  }, [deck]);

  const pickBackImage = useCallback(async () => {
    try {
      const uri = await pickImageNoCrop();
      if (uri) {
        actions.setBackUri(uri);
      }
    } catch (e) {
      console.warn('Back image pick cancelled:', e);
    }
  }, [actions]);

  const confirmSave = useCallback(async () => {
    if (!isModel()) return;
    if (!deckName.trim()) {
      Alert.alert('Name Required', 'Please enter a deck name.');
      return;
    }
    if (!backUri) {
      Alert.alert('Back Image Required', 'Please select a back image for your deck.');
      return;
    }

    const user = getUser();
    const cards: Partial<Record<CardKey, string>> = {};
    Object.entries(deck).forEach(([key, uri]) => {
      if (uri) {
        cards[key as CardKey] = uri;
      }
    });

    const newDeck: Deck = {
      id: `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: deckName.trim(),
      ownerModelId: user.username,
      backUri,
      cards,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      await saveNewDeck(user.username, newDeck);
      actions.resetDraft();
      setShowSaveModal(false);
      Alert.alert('Success', 'Your deck has been saved!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err) {
      console.error('Save deck error:', err);
      Alert.alert('Error', 'Failed to save deck. Please try again.');
    }
  }, [deckName, backUri, deck, actions]);

  if (!isModel()) return null;

  if (!ready) return (
    <>
      <Stack.Screen options={{ title: 'Deck Constructor', headerStyle: { backgroundColor: '#0A0A0F' }, headerTintColor: '#E6E6E6' }} />
      <View style={styles.root} />
    </>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Deck Constructor', headerStyle: { backgroundColor: '#0A0A0F' }, headerTintColor: '#E6E6E6' }} />
      <View style={styles.root}>
        <FlatList
          key={refresh.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 }}
          data={data}
          keyExtractor={(i) => i.key}
          numColumns={4}
          columnWrapperStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1, marginBottom: 10 }}>
              <DeckSlot
                rank={item.rank}
                suit={item.suit}
                uri={deck[item.key] ?? null}
                onPick={() => onPick(item.rank, item.suit)}
              />
            </View>
          )}
        />

        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <Pressable style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveText}>Save Deck</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={showSaveModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.modalBackdropPress} onPress={() => setShowSaveModal(false)} />
          <View style={styles.modalContent}>
            <GlassCard>
              <Text style={styles.modalTitle}>Save Deck</Text>
              
              <Text style={styles.modalLabel}>Deck Name</Text>
              <TextInput
                style={styles.modalInput}
                value={deckName}
                onChangeText={actions.setDeckName}
                placeholder="Enter deck name"
                placeholderTextColor="#666"
              />

              <Text style={styles.modalLabel}>Back Image</Text>
              {backUri ? (
                <View style={styles.backPreview}>
                  <Text style={styles.backPreviewText}>✓ Image selected</Text>
                  <Pressable onPress={pickBackImage}>
                    <Text style={styles.changeText}>Change</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable style={styles.uploadBtn} onPress={pickBackImage}>
                  <Text style={styles.uploadText}>Choose Image</Text>
                </Pressable>
              )}

              <View style={styles.modalActions}>
                <Pressable style={styles.modalBtnCancel} onPress={() => setShowSaveModal(false)}>
                  <Text style={styles.modalBtnCancelText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalBtnConfirm} onPress={confirmSave}>
                  <Text style={styles.modalBtnConfirmText}>Confirm</Text>
                </Pressable>
              </View>
            </GlassCard>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor:'#0A0A0F' },
  saveBtn: { height: 54, borderRadius: 999, backgroundColor:'#00E6E6', alignItems:'center', justifyContent:'center' },
  saveText: { color:'#0A0A0F', fontSize:16, fontWeight:'800' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center' },
  modalBackdropPress: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 },
  modalContent: { paddingHorizontal: 20 },
  modalTitle: { color: '#E6E6E6', fontSize: 24, fontWeight: '800' as const, marginBottom: 20 },
  modalLabel: { color: '#C8CCD2', fontSize: 14, fontWeight: '700' as const, marginTop: 16, marginBottom: 8 },
  modalInput: {
    backgroundColor: '#1A1D26',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#E6E6E6',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2E38',
  },
  uploadBtn: {
    backgroundColor: '#1A1D26',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: '#2A2E38',
  },
  uploadText: { color: '#00E6E6', fontSize: 16, fontWeight: '700' as const },
  backPreview: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: '#1A1D26',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#35E06C',
  },
  backPreviewText: { color: '#35E06C', fontSize: 16, fontWeight: '700' as const },
  changeText: { color: '#00E6E6', fontSize: 14, fontWeight: '700' as const },
  modalActions: { flexDirection: 'row' as const, gap: 12, marginTop: 24 },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#1A1D26',
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: '#2A2E38',
  },
  modalBtnCancelText: { color: '#C8CCD2', fontSize: 16, fontWeight: '800' as const },
  modalBtnConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#00E6E6',
    alignItems: 'center' as const,
  },
  modalBtnConfirmText: { color: '#0A0A0F', fontSize: 16, fontWeight: '800' as const },
});
