import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function SuitHeart({ size = 20, color = '#FF4D7A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 21s-7-4.6-9.5-8A5.6 5.6 0 0 1 12 5.7 5.6 5.6 0 0 1 21.5 13c-2.5 3.4-9.5 8-9.5 8z"
        fill={color}
      />
    </Svg>
  );
}
