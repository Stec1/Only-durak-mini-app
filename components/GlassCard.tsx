import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';

type GlassCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
};

export default function GlassCard({ children, style, padding = tokens.spacing.lg }: GlassCardProps) {
  const themeTokens = useTokens();

  return (
    <View
      style={[
        {
          backgroundColor: themeTokens.cardBg,
          borderRadius: themeTokens.cardRadius,
          borderWidth: 1,
          borderColor: themeTokens.border,
          shadowColor: themeTokens.cardShadow.shadowColor,
          shadowOpacity: themeTokens.cardShadow.shadowOpacity,
          shadowRadius: themeTokens.cardShadow.shadowRadius,
          shadowOffset: themeTokens.cardShadow.shadowOffset,
          elevation: themeTokens.cardShadow.elevation,
          padding,
          ...Platform.select({
            web: {
              backdropFilter: 'blur(10px)',
            },
          }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
