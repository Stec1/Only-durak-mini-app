import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings } from 'lucide-react-native';

import ProfileAvatar from '@/components/ProfileAvatar';
import Capsule from '@/components/Capsule';
import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';

interface HeaderSectionProps {
  displayName: string;
  subtitle: string;
  avatarUri: string | null;
  onAvatarChange: (uri: string | null) => void;
  onSettingsPress: () => void;
}

export default function HeaderSection({ displayName, subtitle, avatarUri, onAvatarChange, onSettingsPress }: HeaderSectionProps) {
  const theme = useTokens();

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
      <View style={styles.settingsWrapper}>
        <TouchableOpacity style={[styles.settingsButton, { borderColor: theme.border }]} onPress={onSettingsPress} activeOpacity={0.75}>
          <Settings color={theme.text} size={22} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <LinearGradient colors={['#4DB2FF', '#9B5CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatarGlow}>
        <View style={[styles.avatarShell, { backgroundColor: theme.bg }]}>
          <ProfileAvatar uri={avatarUri} onImagePicked={onAvatarChange} size={112} />
        </View>
      </LinearGradient>

      <Text style={[styles.name, { color: theme.text }]}>{displayName}</Text>
      <Capsule label={subtitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    paddingVertical: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
    alignItems: 'center',
    gap: tokens.spacing.sm,
    borderWidth: 1,
    shadowColor: '#6AD7FF',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  settingsWrapper: {
    width: '100%',
    alignItems: 'flex-end',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    shadowColor: '#3CF2FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
  },
  avatarGlow: {
    width: 136,
    height: 136,
    borderRadius: 68,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    shadowColor: '#7BF0FF',
    shadowOpacity: 0.45,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 12 },
  },
  avatarShell: {
    width: '100%',
    height: '100%',
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
