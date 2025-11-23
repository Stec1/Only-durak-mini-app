import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors } from '@/constants/tokens';

type OutlineIconProps = {
  Icon: LucideIcon;
  size?: number;
  color?: string;
  style?: ViewStyle;
  glowColor?: string;
};

export default function OutlineIcon({ 
  Icon, 
  size = 24, 
  color = colors.primary, 
  style,
  glowColor,
}: OutlineIconProps) {
  return (
    <View style={[styles.container, style]}>
      <Icon color={color} size={size} strokeWidth={2.5} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
