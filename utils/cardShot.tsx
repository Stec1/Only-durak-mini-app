import React, { useRef } from 'react';
import ViewShot, { captureRef } from 'react-native-view-shot';
import ODCard from '../components/ODCard';
import { SuitKey, Rank } from '../constants/theme';

export async function exportCardToPng(ref: any): Promise<string> {
  return await captureRef(ref, { format: 'png', quality: 1 });
}
