import React from 'react';
import { Pressable, View, StyleSheet, Text } from 'react-native';

type Suit = 'spade'|'heart'|'club'|'diamond';
const suitGlyph = (s: Suit) => (s==='spade'?'♠':s==='heart'?'♥':s==='club'?'♣':'♦');
const suitColor = (s: Suit) =>
  s==='spade'   ? '#00E6E6' :
  s==='heart'   ? '#FF4D7A' :
  s==='club'    ? '#35E58C' :
                  '#5BE1FF';

export default function SimpleCard({ rank='A', suit='spade', onPress }:{
  rank?: string; suit?: Suit; onPress?: ()=>void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={styles.card}>
        <View style={styles.face}>
          <View style={styles.row}>
            <Text style={styles.rank}>{rank}</Text>
            <Text style={[styles.smallSuit, { color: suitColor(suit)}]}>{suitGlyph(suit)}</Text>
          </View>
          <View style={styles.center}>
            <Text style={[styles.bigSuit, { color: suitColor(suit)}]}>{suitGlyph(suit)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  card: {
    backgroundColor: '#13131A',
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  face: {
    backgroundColor: '#F7F7FB',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,230,230,0.35)',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' },
  rank: { fontSize: 16, fontWeight: '700', color: '#111' },
  smallSuit: { fontSize: 16, fontWeight: '700' },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  bigSuit: { fontSize: 36, fontWeight: '700' },
});
