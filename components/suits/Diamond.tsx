import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function SuitDiamond({ size = 20, color = '#5BE1FF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2l7 10-7 10-7-10 7-10z" fill={color} />
    </Svg>
  );
}
