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
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'expo-router';
import { setUserByCredentials } from '@/store/user';
import HoloButton from '@/components/HoloButton';
import InputField from '@/components/InputField';
import SolidCard from '@/components/SolidCard';
import ODModal from '@/components/ODModal';
import BrandTitle from '@/components/BrandTitle';
import { colors, spacing, radius } from '@/constants/tokens';
import { typography } from '@/constants/typography';
import { accentSweep } from '@/constants/gradients';
import { useThemeCtx } from '@/src/contexts/theme';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDNA, setShowDNA] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { setUser, setRole, setDnaAccepted } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useThemeCtx();

  const handleLogin = () => {
    setError('');
    
    if (username === 'Model' && password === '12') {
      setUserByCredentials(username, password);
      setUser({ username: 'Model' });
      setRole('model');
      setDnaAccepted(false);
      setShowDNA(true);
    } else if (username === 'Fan' && password === '34') {
      setUserByCredentials(username, password);
      setUser({ username: 'Fan' });
      setRole('fan');
      setDnaAccepted(false);
      setShowDNA(true);
    } else {
      setError('Invalid credentials');
    }
  };

  const handleDNAAccept = () => {
    if (!isChecked) return;
    setDnaAccepted(true);
    setShowDNA(false);
    setIsChecked(false);
    router.replace('/(tabs)');
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
            </SolidCard>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <ODModal visible={showDNA} onRequestClose={() => {}}>
        <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>DNA Agreement</Text>
        
        <Text style={styles.modalText}>
          This application contains adult-oriented content.
        </Text>
        
        <Text style={styles.modalText}>
          By continuing, you agree to the Only Durak DNA:
        </Text>
        
        <View style={styles.modalList}>
          <Text style={styles.modalListItem}>• You are 18+ years old</Text>
          <Text style={styles.modalListItem}>• You agree not to redistribute or screenshot private content</Text>
          <Text style={styles.modalListItem}>• You respect consent and ownership of creators</Text>
          <Text style={styles.modalListItem}>• You understand that NFTs represent digital collectibles, not physical assets</Text>
        </View>
        
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsChecked(!isChecked)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Check color={colors.bg} size={16} />}
          </View>
          <Text style={styles.checkboxText}>I accept the DNA rules</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.acceptButton, !isChecked && styles.acceptButtonDisabled]}
          onPress={handleDNAAccept}
          disabled={!isChecked}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isChecked ? accentSweep : [colors.surface, colors.surface2] as const}
            style={styles.acceptButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.acceptButtonText, !isChecked && styles.acceptButtonTextDisabled]}>
              Continue
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ODModal>
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
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.lg,
    letterSpacing: 0.5,
  },
  modalText: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  modalList: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  modalListItem: {
    ...typography.meta,
    color: colors.text,
    paddingLeft: spacing.sm,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.line,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkboxText: {
    ...typography.subtitle,
  },
  acceptButton: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  acceptButtonDisabled: {
    opacity: 0.5,
  },
  acceptButtonGradient: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  acceptButtonText: {
    ...typography.subtitle,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
    textShadowColor: colors.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  acceptButtonTextDisabled: {
    textShadowRadius: 0,
    opacity: 0.6,
  },
});
