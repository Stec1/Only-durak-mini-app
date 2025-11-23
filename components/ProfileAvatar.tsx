import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';
import { tokens } from '@/src/theme/tokens';
import { pickImageNoCrop } from '@/src/utils/imagePicker';
import { useAuth } from '@/contexts/auth';
import { useUserStore } from '@/src/state/userStore';
import * as ImagePicker from 'expo-image-picker';

type ProfileAvatarProps = {
  uri?: string | null;
  onImagePicked?: (uri: string) => void;
  size?: number;
};

export default function ProfileAvatar({ uri, onImagePicked, size = 144 }: ProfileAvatarProps) {
  const [loading, setLoading] = useState(false);
  const { setModelAvatar } = useAuth();
  const avatarUri = useUserStore((state) => state.avatarUri);
  const [localUri, setLocalUri] = useState<string | null>(uri || avatarUri || null);

  useEffect(() => {
    if (avatarUri && !uri) {
      setLocalUri(avatarUri);
    }
  }, [avatarUri, uri]);

  const handlePress = async () => {
    try {
      setLoading(true);
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to set an avatar.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      const imageUri = await pickImageNoCrop();
      if (imageUri) {
        await setModelAvatar(imageUri);
        setLocalUri(imageUri);
        onImagePicked?.(imageUri);
      }
    } catch (error) {
      console.error('❌ Failed to pick image:', error);
      
      if (Platform.OS !== 'web') {
        Alert.alert(
          'Upload Failed',
          'Could not set avatar. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={loading}
      style={styles.touchable}
    >
      <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.innerBorder, { borderRadius: (size - 4) / 2 }]}>
          <View style={[styles.circle, { width: size - 8, height: size - 8, borderRadius: (size - 8) / 2 }]}>
            {loading ? (
              <ActivityIndicator size="large" color={tokens.accent} />
            ) : (localUri && localUri.trim()) ? (
              <Image
                source={{ uri: localUri }}
                style={styles.image}
                resizeMode="cover"
                onError={(error) => {
                  console.error('❌ Image load error:', error.nativeEvent.error);
                  setLocalUri(null);
                }}
              />
            ) : (
              <Plus color={tokens.text.secondary} size={size * 0.25} strokeWidth={2.5} />
            )}
          </View>
        </View>
        {!localUri && !loading && (
          <View style={styles.overlay}>
            <View style={[styles.overlayInner, { borderRadius: size / 2 }]} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignSelf: 'center',
  },
  container: {
    padding: 0,
  },
  innerBorder: {
    padding: 0,
  },
  circle: {
    backgroundColor: tokens.card.bg,
    borderWidth: 1,
    borderColor: tokens.card.border,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  overlayInner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
