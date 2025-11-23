import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '@/constants/tokens';
import { typography } from '@/constants/typography';
import { glow } from '@/constants/shadows';
import { accentSweep } from '@/constants/gradients';

type HoloButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function HoloButton({ title, onPress, disabled = false, style }: HoloButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={[styles.container, style, disabled && styles.disabled]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={disabled ? [colors.surface, colors.surface2] as const : accentSweep}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    ...Platform.select({
      ios: glow,
      android: glow,
    }),
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    ...typography.subtitle,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  textDisabled: {
    color: colors.textDim,
  },
});
