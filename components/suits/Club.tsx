import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export function SuitClub({ size = 20, color = '#35E58C' }: { size?: number; color?: string }) {
  const r = size * 0.28;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="6" r={r} fill={color} />
      <Circle cx="7" cy="12" r={r} fill={color} />
      <Circle cx="17" cy="12" r={r} fill={color} />
      <Path d="M11 12h2v8h-2z" fill={color} />
    </Svg>
  );
}
