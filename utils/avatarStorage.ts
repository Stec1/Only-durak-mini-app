import { File, Directory, Paths } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export const KEYS = {
  AVATAR_URI: 'od_model_avatar',
  AVATAR_TIMESTAMP: 'od_model_avatar_timestamp',
} as const;

export const PATHS = {
  AVATARS_DIR: 'avatars',
  AVATAR_FILENAME: 'model-avatar.jpg',
} as const;

export const CONFIG = {
  MAX_WIDTH: 512,
  JPEG_QUALITY: 0.8,
} as const;

function getAvatarDir(): Directory {
  return new Directory(Paths.document, PATHS.AVATARS_DIR);
}

function getAvatarFile(): File {
  return new File(getAvatarDir(), PATHS.AVATAR_FILENAME);
}

async function ensureDirectoryExists(): Promise<void> {
  try {
    const avatarDir = getAvatarDir();
    if (!avatarDir.exists) {
      avatarDir.create({ intermediates: true });
      console.log('✅ Avatar directory created:', avatarDir.uri);
    }
  } catch (error) {
    console.error('❌ Failed to create avatar directory:', error);
    throw error;
  }
}

async function resizeImage(imageUri: string): Promise<string> {
  try {
    console.log('🔄 Resizing image...');
    const result = await manipulateAsync(
      imageUri,
      [{ resize: { width: CONFIG.MAX_WIDTH } }],
      { compress: CONFIG.JPEG_QUALITY, format: SaveFormat.JPEG }
    );
    console.log('✅ Image resized:', result.uri);
    return result.uri;
  } catch (error) {
    console.error('⚠️ Failed to resize image, using original:', error);
    return imageUri;
  }
}

export async function saveAvatar(imageUri: string): Promise<string> {
  try {
    console.log('💾 Saving avatar:', imageUri);
    
    await ensureDirectoryExists();
    
    const destinationFile = getAvatarFile();
    if (destinationFile.exists) {
      console.log('🗑️ Deleting old avatar...');
      destinationFile.delete();
    }
    
    const resizedUri = await resizeImage(imageUri);
    
    const sourceFile = new File(resizedUri);
    sourceFile.copy(destinationFile);
    
    const timestamp = Date.now();
    const uriWithCacheBust = `${destinationFile.uri}?t=${timestamp}`;
    
    await AsyncStorage.setItem(KEYS.AVATAR_URI, destinationFile.uri);
    await AsyncStorage.setItem(KEYS.AVATAR_TIMESTAMP, timestamp.toString());
    
    console.log('✅ Avatar saved with cache bust:', uriWithCacheBust);
    return uriWithCacheBust;
  } catch (error) {
    console.error('❌ Failed to save avatar:', error);
    throw error;
  }
}

export async function loadAvatar(): Promise<string | null> {
  try {
    const storedUri = await AsyncStorage.getItem(KEYS.AVATAR_URI);
    if (!storedUri) {
      console.log('ℹ️ No avatar stored');
      return null;
    }
    
    const avatarFile = getAvatarFile();
    if (!avatarFile.exists) {
      console.log('⚠️ Avatar file missing, cleaning up storage');
      await AsyncStorage.removeItem(KEYS.AVATAR_URI);
      await AsyncStorage.removeItem(KEYS.AVATAR_TIMESTAMP);
      return null;
    }
    
    const timestamp = await AsyncStorage.getItem(KEYS.AVATAR_TIMESTAMP) || Date.now().toString();
    const uriWithCacheBust = `${avatarFile.uri}?t=${timestamp}`;
    
    console.log('✅ Avatar loaded:', uriWithCacheBust);
    return uriWithCacheBust;
  } catch (error) {
    console.error('❌ Failed to load avatar:', error);
    return null;
  }
}

export async function deleteAvatar(): Promise<void> {
  try {
    console.log('🗑️ Deleting avatar...');
    
    const avatarFile = getAvatarFile();
    if (avatarFile.exists) {
      avatarFile.delete();
      console.log('✅ Avatar file deleted');
    }
    
    await AsyncStorage.removeItem(KEYS.AVATAR_URI);
    await AsyncStorage.removeItem(KEYS.AVATAR_TIMESTAMP);
    
    console.log('✅ Avatar storage cleaned');
  } catch (error) {
    console.error('❌ Failed to delete avatar:', error);
    throw error;
  }
}
