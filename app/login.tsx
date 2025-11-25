import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'expo-router';
import HoloButton from '@/components/HoloButton';
import InputField from '@/components/InputField';
import SolidCard from '@/components/SolidCard';
import BrandTitle from '@/components/BrandTitle';
import { colors, spacing, radius } from '@/constants/tokens';
import { typography } from '@/constants/typography';
import { useThemeCtx } from '@/src/contexts/theme';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const [showDNA, setShowDNA] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { setUser, setDnaAccepted } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeCtx();

  const handleLogin = async () => {
    setError('');

    try {
      await login(username, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to log in';
      setError(message);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
          <View style={[styles.content, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom }]}>
            <View style={styles.titleContainer}>
              <BrandTitle />
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>ENTER THE ROOM</Text>
            </View>

            <SolidCard style={styles.card}>
              <InputField
                label="Username"
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />

              <InputField
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <HoloButton
                title="Enter"
                onPress={handleLogin}
                style={styles.loginButton}
              />

              <TouchableOpacity
                onPress={() => router.replace('/register')}
                style={styles.linkButton}
                activeOpacity={0.8}
              >
                <Text style={[styles.linkText, { color: theme.textSecondary }]}>Don’t have an account? Create one</Text>
              </TouchableOpacity>
            </SolidCard>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  titleContainer: {
    marginTop: 56,
    marginBottom: 32,
    alignItems: 'center',
  },

  subtitle: {
    fontSize: 14,
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase' as const,
    marginTop: spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    padding: spacing.xl,
    marginTop: 24,
  },
  input: {
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.meta,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.sm,
    width: '100%',
    height: 52,
  },
  linkButton: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  linkText: {
    ...typography.meta,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
});
