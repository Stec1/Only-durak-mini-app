import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '@/constants/theme';

type NeonButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
};

export default function NeonButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: NeonButtonProps) {
  const getGradientColors = (): readonly [string, string, ...string[]] => {
    switch (variant) {
      case 'secondary':
        return [Theme.colors.neon.purple, Theme.colors.neon.pink] as const;
      case 'danger':
        return ['rgba(255, 59, 48, 0.8)', 'rgba(255, 59, 48, 0.6)'] as const;
      default:
        return [Theme.colors.neon.cyan, Theme.colors.neon.purple] as const;
    }
  };

  const getShadowColor = () => {
    switch (variant) {
      case 'secondary':
        return Theme.colors.neon.purple;
      case 'danger':
        return '#ff3b30';
      default:
        return Theme.colors.neon.cyan;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={disabled ? ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'] as const : getGradientColors()}
        style={[
          styles.gradient,
          ...Platform.select({
            ios: !disabled ? [{
              shadowColor: getShadowColor(),
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.7,
              shadowRadius: 20,
            }] : [],
            android: !disabled ? [{
              elevation: 10,
            }] : [],
            default: [],
          }),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.text, disabled && styles.textDisabled]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.radius.md,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Theme.textStyles.button,
    textShadowColor: Theme.colors.shadow.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  textDisabled: {
    textShadowRadius: 0,
    opacity: 0.6,
  },
});
