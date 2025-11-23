import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions, Animated, TouchableOpacity, Platform } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDeck } from '@/storage/decks';
import { Deck, Suit, Rank } from '@/types/deck';
import { getUser, isModel } from '@/store/user';
import { order } from '@/utils/cardsOrder';
import ODCard from '@/components/ODCard';
import PlayingCardPremium from '@/src/components/cards/PlayingCardPremium';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function CardItem({ cardKey, uri }: { cardKey: string; uri?: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const [rank, suit] = cardKey.split('_') as [Rank, Suit];

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.08,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.cardContainer}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {uri ? (
          <PlayingCardPremium
            imageUri={uri}
            rank={rank}
            suit={suit as 'spade' | 'heart' | 'club' | 'diamond'}
            width={280}
          />
        ) : (
          <ODCard rank={rank} suit={suit} photoUri={null} width={280} />
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function DeckDetailScreen() {
  const insets = useSafeAreaInsets();
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isModel()) {
      router.back();
      return;
    }

    const user = getUser();
    getDeck(user.username, deckId || '').then((d) => {
      setDeck(d);
      setLoading(false);
    });
  }, [deckId]);

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Deck',
            headerStyle: { backgroundColor: '#0A0A0F' },
            headerTintColor: '#E6E6E6',
          }}
        />
        <View style={[styles.root, { paddingTop: insets.top }]} />
      </>
    );
  }

  if (!deck) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Deck Not Found',
            headerStyle: { backgroundColor: '#0A0A0F' },
            headerTintColor: '#E6E6E6',
          }}
        />
        <View style={[styles.root, { paddingTop: insets.top }]}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Deck not found</Text>
          </View>
        </View>
      </>
    );
  }

  const cardData = order.map((key) => ({
    key,
    uri: deck.cards[key],
  }));

  return (
    <>
      <Stack.Screen
        options={{
          title: deck.name,
          headerStyle: { backgroundColor: '#0A0A0F' },
          headerTintColor: '#E6E6E6',
        }}
      />
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 12 }]}
          onPress={async () => {
            if (Platform.OS !== 'web') {
              try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {}
            }
            router.back();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.backButtonInner}>
            <ChevronLeft color="#06D7D9" size={24} strokeWidth={2.5} />
            <Text style={styles.backButtonText}>Back</Text>
          </View>
        </TouchableOpacity>
        <FlatList
          data={cardData}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={SCREEN_WIDTH}
          snapToAlignment="center"
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          renderItem={({ item }) => <CardItem cardKey={item.key} uri={item.uri} />}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {Object.keys(deck.cards).length} / 36 cards
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#9BA0A6',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#9BA0A6',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 100,
  },
  backButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 215, 217, 0.12)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(6, 215, 217, 0.3)',
  },
  backButtonText: {
    color: '#06D7D9',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
