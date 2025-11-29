import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTokens } from '@/src/contexts/theme';

type SolidCardProps = ViewProps & { 
  rounded?: number;
  padding?: number;
};

export default function SolidCard({ style, rounded = 24, padding, children, ...rest }: SolidCardProps) {
  const tokens = useTokens();

  return (
    <View
      style={[
        {
          backgroundColor: tokens.cardBg,
          borderWidth: 1,
          borderColor: tokens.border,
          borderRadius: rounded,
          shadowColor: tokens.cardShadow.shadowColor,
          shadowOpacity: tokens.cardShadow.shadowOpacity,
          shadowRadius: tokens.cardShadow.shadowRadius,
          shadowOffset: tokens.cardShadow.shadowOffset,
          elevation: tokens.cardShadow.elevation,
        },
        padding !== undefined && { padding },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
