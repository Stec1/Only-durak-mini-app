import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '@/src/theme/tokens';

type DividerProps = {
  style?: ViewStyle;
};

export default function Divider({ style }: DividerProps) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: tokens.divider,
  },
});
