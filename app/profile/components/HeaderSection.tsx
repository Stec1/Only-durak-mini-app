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
    <View style={styles.container}>
      <View style={styles.settingsWrapper}>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
          onPress={onSettingsPress}
          activeOpacity={0.75}
        >
          <Settings color={theme.text} size={22} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <LinearGradient colors={['#4DB2FF', '#9B5CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatarGlow}>
        <ProfileAvatar uri={avatarUri} onImagePicked={onAvatarChange} size={112} />
      </LinearGradient>

      <Text style={[styles.name, { color: theme.text }]}>{displayName}</Text>
      <Capsule label={subtitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: tokens.spacing.sm,
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
    borderWidth: 1,
    shadowColor: '#4DB2FF',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  avatarGlow: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    shadowColor: '#7BF0FF',
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
