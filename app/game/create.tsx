import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import GlassCard from '@/components/GlassCard';
import HoloButton from '@/components/HoloButton';
import { tokens } from '@/src/theme/tokens';
import { useTokens } from '@/src/contexts/theme';

export default function CreateRoom() {
  const router = useRouter();
  const [name, setName] = useState('OnlyDurak Room');
  const [maxPlayers, setMaxPlayers] = useState('4');
  const [isPrivate, setIsPrivate] = useState(false);
  const [pin, setPin] = useState('');
  const insets = useSafeAreaInsets();
  const themeTokens = useTokens();
  const styles = useMemo(() => createStyles(themeTokens), [themeTokens]);

  const handleCreate = useCallback(() => {
    console.log('Creating room:', { name, maxPlayers, isPrivate, pin });
    router.push('/game/room' as any);
  }, [isPrivate, maxPlayers, name, pin, router]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: themeTokens.bg }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + tokens.spacing.xl,
              paddingBottom: insets.bottom + tokens.spacing['2xl'],
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <GlassCard style={styles.card}>
            <Text style={styles.label}>CREATE ROOM</Text>
            <Text style={styles.title}>Host a Room 3 match</Text>
            <Text style={[styles.subtitle, { color: themeTokens.subtext }]}>
              Set up a table for 1 model and 2 fans. Configure players and privacy.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: themeTokens.subtext }]}>Room Name</Text>
              <TextInput
                style={[styles.input, { color: themeTokens.text, borderColor: themeTokens.border, backgroundColor: themeTokens.cardBg }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter room name"
                placeholderTextColor={themeTokens.subtext}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: themeTokens.subtext }]}>Max Players (2–6)</Text>
              <TextInput
                style={[styles.input, { color: themeTokens.text, borderColor: themeTokens.border, backgroundColor: themeTokens.cardBg }]}
                value={maxPlayers}
                onChangeText={setMaxPlayers}
                keyboardType="number-pad"
                placeholder="4"
                placeholderTextColor={themeTokens.subtext}
              />
            </View>

            <View style={[styles.switchRow, { borderColor: themeTokens.border }]}> 
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{ false: themeTokens.border, true: themeTokens.accentSoft }}
                thumbColor={themeTokens.accent}
              />
              <Text style={[styles.switchLabel, { color: themeTokens.text }]}>Private room (PIN)</Text>
            </View>

            {isPrivate && (
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: themeTokens.subtext }]}>PIN</Text>
                <TextInput
                  style={[styles.input, { color: themeTokens.text, borderColor: themeTokens.border, backgroundColor: themeTokens.cardBg }]}
                  value={pin}
                  onChangeText={setPin}
                  placeholder="Enter PIN"
                  placeholderTextColor={themeTokens.subtext}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
            )}

            <HoloButton title="Create & Ready" onPress={handleCreate} style={styles.primaryButton} />

            <TouchableOpacity onPress={handleCancel} style={[styles.secondaryButton, { borderColor: themeTokens.border }]}>
              <Text style={[styles.secondaryText, { color: themeTokens.accent }]}>Cancel</Text>
            </TouchableOpacity>
          </GlassCard>
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
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: tokens.spacing.lg,
    },
    card: {
      gap: tokens.spacing.lg,
    },
    label: {
      ...tokens.typography.meta,
      color: themeTokens.subtext,
      letterSpacing: 1,
    },
    title: {
      ...tokens.typography.h2,
      color: themeTokens.text,
    },
    subtitle: {
      ...tokens.typography.body,
      lineHeight: 22,
    },
    fieldGroup: {
      gap: tokens.spacing.sm,
    },
    fieldLabel: {
      ...tokens.typography.h4,
    },
    input: {
      borderWidth: 1,
      borderRadius: tokens.borderRadius.lg,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.md,
      fontSize: 16,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.md,
      padding: tokens.spacing.md,
      borderWidth: 1,
      borderRadius: tokens.borderRadius.lg,
    },
    switchLabel: {
      ...tokens.typography.body,
      flex: 1,
    },
    primaryButton: {
      width: '100%',
    },
    secondaryButton: {
      width: '100%',
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.borderRadius.lg,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeTokens.bg,
    },
    secondaryText: {
      ...tokens.typography.h4,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
  });
