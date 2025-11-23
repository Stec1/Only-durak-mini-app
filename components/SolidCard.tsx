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
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
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
