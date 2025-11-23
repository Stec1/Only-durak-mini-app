import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook to persist a single image URI in AsyncStorage.
 * 
 * @param key - Unique AsyncStorage key for this image
 * @returns { uri, setUri, clear, isLoading }
 */
export function useLocalImage(key: string) {
  const [uri, setUriState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        if (stored && stored.trim()) {
          setUriState(stored);
        }
      } catch (error) {
        console.error(`❌ Failed to load image for key "${key}":`, error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [key]);

  const setUri = async (newUri: string | null) => {
    try {
      if (newUri && newUri.trim()) {
        await AsyncStorage.setItem(key, newUri);
        setUriState(newUri);
        console.log(`✅ Image saved for key "${key}":`, newUri);
      } else {
        await AsyncStorage.removeItem(key);
        setUriState(null);
        console.log(`✅ Image cleared for key "${key}"`);
      }
    } catch (error) {
      console.error(`❌ Failed to save image for key "${key}":`, error);
    }
  };

  const clear = () => setUri(null);

  return { uri, setUri, clear, isLoading };
}
