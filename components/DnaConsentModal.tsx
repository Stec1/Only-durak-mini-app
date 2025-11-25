import React from 'react';
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

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel} activeOpacity={0.85}>
          <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onAgree} activeOpacity={0.9}>
          <Text style={[styles.buttonText, styles.confirmText]}>I agree</Text>
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
  cancelText: {
    color: colors.text,
  },
  confirmText: {
    color: colors.bg,
  },
});
