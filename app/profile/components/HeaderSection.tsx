import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    <View style={[styles.container, { shadowColor: '#3CF2FF' }]}>
      <View style={styles.settingsWrapper}>
        <TouchableOpacity style={[styles.settingsButton, { borderColor: theme.border }]} onPress={onSettingsPress} activeOpacity={0.75}>
          <Settings color={theme.text} size={22} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarGlow}>
        <ProfileAvatar uri={avatarUri} onImagePicked={onAvatarChange} size={92} />
      </View>

      <Text style={[styles.name, { color: theme.text }]}>{displayName}</Text>
      <Capsule label={subtitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 26,
    padding: tokens.spacing.lg,
    alignItems: 'center',
    gap: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 255, 0.25)',
    // @ts-expect-error web-only blur support
    backdropFilter: 'blur(22px)',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 255, 0.08)',
    shadowColor: '#3CF2FF',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
