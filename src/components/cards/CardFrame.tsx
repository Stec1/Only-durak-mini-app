import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { CARD_ASPECT, CARD_RADIUS, CARD_PADDING } from '../../theme/cards';

type Props = PropsWithChildren<{
  width?: number | string;     // e.g. '100%' or number
  style?: any;
}>;

export const CardFrame: React.FC<Props> = ({ width = '100%', style, children }) => {
  return (
    <View style={[styles.outer, { width }, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    aspectRatio: CARD_ASPECT,          // 5:7
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',                // MASK!
    backgroundColor: '#0A0A0A',        // card base - deep black
  },
  inner: {
    flex: 1,
    margin: CARD_PADDING,              // visual gap between rim and content
    borderRadius: CARD_RADIUS - CARD_PADDING,
    overflow: 'hidden',                // mask inner content as well
  },
});
