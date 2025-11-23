import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Suit, Rank } from '../utils/deck';
import { CARD_RADIUS } from '@/src/theme/cards';
import SafeImage from './SafeImage';

const suitGlyph = (s: Suit) => (s==='spade'?'♠':s==='heart'?'♥':s==='club'?'♣':'♦');
const suitColor = (s: Suit) =>
  s==='spade' ? '#00E6E6' :
  s==='heart' ? '#FF4D7A' :
  s==='club'  ? '#35E58C' :
                '#5BE1FF';

export default function DeckTile({
  rank, suit, uri, onPress,
}: { rank: Rank; suit: Suit; uri?: string | null; onPress?: () => void; }) {
  const has = !!uri;

  return (
    <Pressable onPress={onPress} style={styles.cell}>
      <View style={[styles.card, { borderColor: has ? 'rgba(0,230,230,0.35)' : 'rgba(255,255,255,0.08)'}]}>
        <View style={styles.headRow}>
          <Text style={styles.rank}>{rank}</Text>
          <Text style={[styles.smallSuit, { color: suitColor(suit)}]}>{suitGlyph(suit)}</Text>
        </View>

        <View style={styles.preview}>
          {has ? (
            <SafeImage source={{ uri: uri || '' }} fallbackType="nft" style={styles.img} resizeMode="cover" />
          ) : (
            <View style={styles.addBox}>
              <Text style={styles.plus}>＋</Text>
              <Text style={styles.addText}>Add photo</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1 },
  card: {
    backgroundColor: '#111218',
    borderRadius: CARD_RADIUS * 0.67,
    padding: 10,
    borderWidth: 1,
  },
  headRow: { flexDirection: 'row', justifyContent:'space-between', alignItems:'center' },
  rank: { color:'#E6E6E6', fontSize:16, fontWeight:'800' },
  smallSuit: { fontSize:16, fontWeight:'900' },
  preview: { height: 84, borderRadius: CARD_RADIUS * 0.42, overflow:'hidden', marginTop: 8, backgroundColor:'#0F1015', alignItems:'center', justifyContent:'center' },
  img: { width: '100%', height: '100%' },
  addBox: { alignItems:'center', justifyContent:'center' },
  plus: { color:'#00E6E6', fontSize:28, fontWeight:'900', marginBottom: 6 },
  addText: { color:'#9BA0A6', fontSize:12, fontWeight:'700' },
});
