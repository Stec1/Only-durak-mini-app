import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function SuitSpade({ size = 20, color = '#00E6E6' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2C9 5 5 8 5 11.5A3.5 3.5 0 0 0 9 15c.8 0 1.5-.2 2-.5V20h2v-5.5c.5.3 1.2.5 2 .5a3.5 3.5 0 0 0 4-3.5C19 8 15 5 12 2z"
        fill={color}
      />
    </Svg>
  );
}
