import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BrandTitle from '@/components/BrandTitle';
import InputField from '@/components/InputField';
import SolidCard from '@/components/SolidCard';
import HoloButton from '@/components/HoloButton';
import { colors, radius, spacing } from '@/constants/tokens';
import { typography } from '@/constants/typography';
import { useThemeCtx } from '@/src/contexts/theme';
import { Role } from '@/types/user';
import { useAuth } from '@/contexts/auth';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('model');
  const [error, setError] = useState('');
  const { registerUser } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeCtx();

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setError('');
    await registerUser(name.trim(), role);
    router.replace('/(tabs)');
  };

  const renderRoleButton = (label: string, value: Role) => {
    const isActive = role === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.roleButton, isActive && styles.roleButtonActive]}
        onPress={() => setRole(value)}
        activeOpacity={0.9}
      >
        <Text style={[styles.roleButtonLabel, isActive && styles.roleButtonLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom, backgroundColor: theme.bg }]}>
        <View style={styles.header}>
          <BrandTitle />
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Create your account</Text>
        </View>

        <SolidCard style={styles.card}>
          <InputField
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect
            style={styles.input}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Account type</Text>
          <View style={styles.roleContainer}>
            {renderRoleButton('Model', 'model')}
            {renderRoleButton('Fan', 'fan')}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <HoloButton
            title="CREATE ACCOUNT"
            onPress={handleSubmit}
            style={styles.submitButton}
          />

          <TouchableOpacity
            onPress={() => router.replace('/login')}
            style={styles.linkButton}
            activeOpacity={0.8}
          >
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </SolidCard>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  subtitle: {
    ...typography.meta,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
    marginTop: spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    padding: spacing.xl,
  },
  input: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.subtitle,
    marginBottom: spacing.sm,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  roleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '1A',
  },
  roleButtonLabel: {
    ...typography.subtitle,
    color: colors.text,
  },
  roleButtonLabelActive: {
    color: colors.primary,
  },
  errorText: {
    ...typography.meta,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
    width: '100%',
    height: 52,
  },
});
