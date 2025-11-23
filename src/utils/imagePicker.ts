import * as ImagePicker from 'expo-image-picker';

export async function pickImageNoCrop(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Photo library access was denied. Please enable it in your device settings');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    aspect: undefined,
    quality: 1,
    exif: false,
    base64: false,
  });

  if (result.canceled) return null;
  return result.assets?.[0]?.uri ?? null;
}
