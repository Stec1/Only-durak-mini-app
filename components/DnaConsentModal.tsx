import React, {
  useEffect,
  useState,
} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ODModal from '@/components/ODModal';
import { colors, spacing, radius } from '@/constants/tokens';
import { typography } from '@/constants/typography';

interface Props {
  visible: boolean;
  onAgree: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
}

export default function DnaConsentModal({ visible, onAgree, onCancel }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!visible) {
      setConfirmed(false);
    }
  }, [visible]);

  const toggleConfirm = () => {
    setConfirmed((prev) => !prev);
  };

  return (
    <ODModal visible={visible} onRequestClose={onCancel}>
      <Text style={styles.title}>Only Durak DNA Rules</Text>
      <Text style={styles.body}>We keep the game respectful and safe for everyone.</Text>

      <View style={styles.list}>
        <Text style={styles.listItem}>• You confirm you are 18+.</Text>
        <Text style={styles.listItem}>• You respect privacy and do not share private content.</Text>
        <Text style={styles.listItem}>• You follow consent-first interactions with all creators.</Text>
        <Text style={styles.listItem}>• You understand collectibles stay digital.</Text>
      </View>

      <TouchableOpacity style={styles.checkboxRow} onPress={toggleConfirm} activeOpacity={0.85}>
        <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
          {confirmed ? <Text style={styles.checkboxMark}>✓</Text> : null}
        </View>
        <Text style={styles.checkboxLabel}>I have read and agree to the DNA rules.</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel} activeOpacity={0.85}>
          <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton, !confirmed && styles.disabledButton]}
          onPress={onAgree}
          activeOpacity={0.9}
          disabled={!confirmed}
        >
          <Text style={[styles.buttonText, styles.confirmText]}>Accept &amp; continue</Text>
        </TouchableOpacity>
      </View>
    </ODModal>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body,
    marginBottom: spacing.md,
    color: colors.textDim,
  },
  list: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  listItem: {
    ...typography.meta,
    color: colors.text,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '1A',
  },
  checkboxMark: {
    color: colors.primary,
    fontWeight: '700',
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  buttonText: {
    ...typography.subtitle,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelText: {
    color: colors.text,
  },
  confirmText: {
    color: colors.bg,
  },
});
