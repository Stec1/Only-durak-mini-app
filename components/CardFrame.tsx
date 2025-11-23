import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { GAME_COLORS, SUIT_CONFIG } from '../constants/theme';
import type { Suit, Rank } from '../utils/deck';
import { CARD_RADIUS, CARD_PADDING } from '@/src/theme/cards';

type Props = { suit: Suit; rank: Rank; width: number; height: number; };

export default function CardFrame({ suit, rank, width, height }: Props) {
  const radius = CARD_RADIUS;
  const pad = CARD_PADDING;
  const pipSize = Math.min(width, height) * 0.16;
  const rankSize = Math.min(width, height) * 0.18;
  const stroke = 2;

  const s = SUIT_CONFIG[suit];

  return (
    <View style={{ position:'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Svg width={width} height={height}>
        <Rect x={0+stroke/2} y={0+stroke/2} rx={radius} ry={radius}
          width={width-stroke} height={height-stroke}
          fill="transparent" stroke={s.color} strokeWidth={stroke} />

        <Rect x={pad} y={pad} rx={radius*0.6} ry={radius*0.6}
          width={width-pad*2} height={height-pad*2}
          fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

        <SvgText
          x={pad*0.9} y={pad*1.2}
          fill={GAME_COLORS.text} fontSize={rankSize} fontWeight="700"
          textAnchor="start" alignmentBaseline="hanging">
          {rank}
        </SvgText>
        <SvgText
          x={pad*0.9} y={pad*1.2 + pipSize}
          fill={s.color} fontSize={pipSize} fontWeight="700"
          textAnchor="start" alignmentBaseline="hanging">
          {s.pip}
        </SvgText>

        <SvgText
          x={width - pad*0.9} y={height - (pad*1.2 + pipSize)}
          fill={s.color} fontSize={pipSize} fontWeight="700"
          textAnchor="end" alignmentBaseline="hanging">
          {s.pip}
        </SvgText>
        <SvgText
          x={width - pad*0.9} y={height - pad*0.9}
          fill={GAME_COLORS.text} fontSize={rankSize} fontWeight="700"
          textAnchor="end" alignmentBaseline="baseline">
          {rank}
        </SvgText>
      </Svg>
    </View>
  );
}
