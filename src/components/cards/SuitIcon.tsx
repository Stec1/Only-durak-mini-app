import React from 'react';
import { SuitSpade, SuitHeart, SuitClub, SuitDiamond } from '@/components/suits';

type SuitType = 'spade' | 'heart' | 'club' | 'diamond';

type SuitIconProps = {
  suit: SuitType;
  size: number;
  color: string;
};

export function SuitIcon({ suit, size, color }: SuitIconProps) {
  switch (suit) {
    case 'spade':
      return <SuitSpade size={size} color={color} />;
    case 'heart':
      return <SuitHeart size={size} color={color} />;
    case 'club':
      return <SuitClub size={size} color={color} />;
    case 'diamond':
      return <SuitDiamond size={size} color={color} />;
    default:
      return null;
  }
}
