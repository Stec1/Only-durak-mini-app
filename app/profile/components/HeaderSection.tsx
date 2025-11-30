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

      <View style={styles.avatarWrapper}>
        <ProfileAvatar uri={avatarUri} onImagePicked={onAvatarChange} size={148} />
      </View>

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
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
