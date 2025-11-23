import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import { CARD_ASPECT, CARD_RADIUS } from '@/src/theme/cards';
import { BackArtImage } from '@/src/components/cards/BackArtImage';

type Props = {
  name: string;
  backUri: string;
  onPressSettings?: () => void;
};

export function DeckThumb({ name, backUri, onPressSettings }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.backContainer}>
        <BackArtImage uri={backUri} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {onPressSettings && (
          <TouchableOpacity
            onPress={onPressSettings}
            style={styles.settingsBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Settings size={18} color="#9BA5B4" strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 132, marginRight: 16 },
  backContainer: {
    width: 132,
    aspectRatio: CARD_ASPECT,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2B3A40',
    backgroundColor: '#0F1015',
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 4,
  },
  name: {
    color: '#E7F7F8',
    fontWeight: '700' as const,
    fontSize: 14,
    flex: 1,
  },
  settingsBtn: {
    padding: 4,
    marginLeft: 6,
  },
});
