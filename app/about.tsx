import React from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTokens } from '@/src/contexts/theme';

import { spacing } from '@/constants/tokens';
import { typography } from '@/constants/typography';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const themeTokens = useTokens();
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeTokens.bg }]} edges={['top']}>
      <TouchableOpacity 
        style={[styles.backButton, { backgroundColor: themeTokens.cardBg + '14' }]} 
        onPress={() => router.back()}
      >
        <ChevronLeft size={30} color={themeTokens.text} />
      </TouchableOpacity>
      
      <ScrollView 
        style={[styles.container, { backgroundColor: themeTokens.bg }]}
        contentContainerStyle={{ 
          paddingTop: spacing.xl,
          paddingBottom: insets.bottom + spacing.xl 
        }}
        showsVerticalScrollIndicator={false}
      >
      <Text style={[styles.title, { color: themeTokens.text }]}>About Only Durak</Text>
      
      <Text style={[styles.text, { color: themeTokens.subtext }]}>
        Only Durak — це NFT-гральна платформа нового покоління, створена на базі штучного інтелекту. 
        Вона поєднує класику карткової гри &ldquo;Дурак&rdquo; із Web3 технологіями, дозволяючи гравцям 
        створювати унікальні колоди, колекціонувати NFT-карти та змагатись між собою у турнірах.
      </Text>

      <Text style={[styles.text, { color: themeTokens.subtext }]}>
        Кожна карта в Only Durak — це цифровий витвір мистецтва, згенерований нейромережею. 
        Гравці можуть персоналізувати свій профіль, заробляти кредити та брати участь у 
        рейтингових матчах, де NFT використовуються як унікальні активи.
      </Text>

      <Text style={[styles.text, { color: themeTokens.subtext }]}>
        Only Durak — це не просто гра, а спільнота творців, колекціонерів і гравців, 
        об&apos;єднаних любов&apos;ю до стратегій, NFT та нових технологій.
      </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    marginBottom: spacing.xl,
  },
  text: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },

  backButton: {
    position: 'absolute',
    top: 52,
    right: spacing.lg,
    zIndex: 10,
    padding: 8,
    borderRadius: 50,
  },
});
