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
          borderRadius: tokens.card.radius,
          borderWidth: 1,
          borderColor: themeTokens.border,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
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
