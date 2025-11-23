import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/src/theme/tokens';
import { Info } from 'lucide-react-native';
import Screen from '@/src/components/ui/Screen';

export default function CreateRoom() {
  const router = useRouter();
  const [name, setName] = useState('OnlyDurak Room');
  const [maxPlayers, setMaxPlayers] = useState('4');
  const [isPrivate, setIsPrivate] = useState(false);
  const [pin, setPin] = useState('');

  const handleCreate = () => {
    console.log('Creating room:', { name, maxPlayers, isPrivate, pin });
    router.push('/game/room' as any);
  };

  return (
    <Screen style={styles.content}>
        {Platform.OS === 'web' && (
          <View style={styles.infoBanner}>
            <Info color="#19E3E3" size={20} strokeWidth={2.5} />
            <Text style={styles.infoText}>
              Multiplayer disabled on Web preview
            </Text>
          </View>
        )}

        <Text style={styles.label}>Room Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter room name"
          placeholderTextColor="rgba(230, 231, 235, 0.4)"
        />

        <Text style={styles.label}>Max Players (2–6)</Text>
        <TextInput
          style={styles.input}
          value={maxPlayers}
          onChangeText={setMaxPlayers}
          keyboardType="number-pad"
          placeholder="4"
          placeholderTextColor="rgba(230, 231, 235, 0.4)"
        />

        <View style={styles.switchRow}>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: '#3e3e3e', true: '#19E3E3' }}
            thumbColor="#ffffff"
          />
          <Text style={styles.switchLabel}>Private room (PIN)</Text>
        </View>

        {isPrivate && (
          <>
            <Text style={styles.label}>PIN</Text>
            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={setPin}
              placeholder="Enter PIN"
              placeholderTextColor="rgba(230, 231, 235, 0.4)"
              keyboardType="number-pad"
              maxLength={6}
            />
          </>
        )}

        <View style={styles.buttonsContainer}>
          <Pressable style={styles.btnPrimary} onPress={handleCreate}>
            <Text style={styles.btnPrimaryText}>Create & Ready</Text>
          </Pressable>

          <Pressable style={styles.btnOutline} onPress={() => router.back()}>
            <Text style={styles.btnOutlineText}>Cancel</Text>
          </Pressable>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: tokens.spacing.lg,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    backgroundColor: 'rgba(25, 227, 227, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(25, 227, 227, 0.3)',
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  infoText: {
    flex: 1,
    color: '#19E3E3',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  label: {
    ...tokens.typography.body,
    color: tokens.text.primary,
    marginBottom: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
  },
  input: {
    backgroundColor: '#241F28',
    borderRadius: tokens.borderRadius.lg,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    color: tokens.text.primary,
    fontSize: 16,
    marginBottom: tokens.spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    marginVertical: tokens.spacing.md,
  },
  switchLabel: {
    ...tokens.typography.body,
    color: tokens.text.primary,
  },
  buttonsContainer: {
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.xl,
  },
  btnPrimary: {
    height: 54,
    borderRadius: 999,
    backgroundColor: '#19E3E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  btnOutline: {
    height: 54,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#19E3E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    color: '#19E3E3',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
