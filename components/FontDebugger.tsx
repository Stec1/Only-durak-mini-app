import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Font Test Component - Shows all loaded fonts
 * Use this to debug font loading issues
 */
export default function FontDebugger() {
  const fonts = [
    'Allura_400Regular',
    'Orbitron_700Bold',
    'Orbitron_800ExtraBold',
    'Inter_400Regular',
    'Inter_500Medium',
    'Inter_600SemiBold',
    'Rajdhani_600SemiBold',
    'Rajdhani_700Bold',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔍 Font Debug Panel</Text>
      {fonts.map((font) => (
        <View key={font} style={styles.row}>
          <Text style={styles.label}>{font}:</Text>
          <Text style={[styles.sample, { fontFamily: font }]}>
            Only Durak Sample
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1A1A1A',
    margin: 10,
    borderRadius: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00E6E6',
    marginBottom: 16,
  },
  row: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#0A0A0F',
    borderRadius: 8,
  },
  label: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  sample: {
    fontSize: 20,
    color: '#FFF',
  },
});
