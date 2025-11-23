import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, Platform } from 'react-native';
import { colors, radius, spacing } from '@/constants/tokens';
import { typography } from '@/constants/typography';

type InputFieldProps = TextInputProps & {
  label: string;
};

export default function InputField({ label, style, ...props }: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        placeholderTextColor={colors.textDim}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...typography.meta,
    color: colors.text,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: colors.text,
    minHeight: 48,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  inputFocused: {
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
