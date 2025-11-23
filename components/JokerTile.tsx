import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { tokens } from '@/src/theme/tokens';
import { useLocalImage } from '@/src/hooks/useLocalImage';
import SafeImage from '@/components/SafeImage';
import { Plus, RefreshCw } from 'lucide-react-native';

type JokerTileProps = {
  label: string;
  storageKey: string;
  iconComponent?: React.ReactNode;
};

export default function JokerTile({ label, storageKey, iconComponent }: JokerTileProps) {
  const { uri, setUri, clear, isLoading } = useLocalImage(storageKey);
  const [picking, setPicking] = useState(false);

  const pickImage = async () => {
    try {
      setPicking(true);

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to set Joker images.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        await setUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('❌ Failed to pick Joker image:', error);

      if (Platform.OS !== 'web') {
        Alert.alert(
          'Upload Failed',
          'Could not set Joker image. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setPicking(false);
    }
  };

  const handleLongPress = () => {
    if (!uri) return;

    Alert.alert(
      'Clear Image',
      `Remove the photo from ${label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clear(),
        },
      ]
    );
  };

  const showLoading = isLoading || picking;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={pickImage}
      onLongPress={handleLongPress}
      disabled={showLoading}
    >
      {showLoading ? (
        <View style={styles.content}>
          <ActivityIndicator size="large" color={tokens.accent} />
        </View>
      ) : uri && uri.trim() ? (
        <>
          <SafeImage
            source={{ uri }}
            fallbackType="nft"
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <RefreshCw color="#FFFFFF" size={14} strokeWidth={2.5} />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.content}>
          {iconComponent || (
            <View style={styles.iconCircle}>
              <Plus color={tokens.text.secondary} size={28} strokeWidth={2.5} />
            </View>
          )}
          <Text style={styles.label}>{label}</Text>
          <View style={styles.addHint}>
            <Plus color={tokens.text.secondary} size={16} strokeWidth={2.5} />
            <Text style={styles.addHintText}>Tap to add</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.md,
    gap: tokens.spacing.xs,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(58, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    color: tokens.text.primary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  addHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  addHintText: {
    color: tokens.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  changeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
