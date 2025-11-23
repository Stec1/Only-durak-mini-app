import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useTheme, useTokens } from '@/src/contexts/theme';
import { THEMES, THEME_SWATCHES, THEME_LABELS, ThemeName } from '@/src/theme/themes';
import { spacing } from '@/constants/tokens';
import { typography } from '@/constants/typography';
import SolidCard from '@/components/SolidCard';
import Divider from '@/components/Divider';

type ThemePickerSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ThemePickerSheet({ visible, onClose }: ThemePickerSheetProps) {
  const insets = useSafeAreaInsets();
  const { themeName, setTheme } = useTheme();
  const tokens = useTokens();

  const handleSelectTheme = (name: ThemeName) => {
    setTheme(name);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
      >
        <View style={[styles.container, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <SolidCard padding={0}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: tokens.text }]}>Choose Theme</Text>
              </View>

              <Divider />

              <View style={styles.swatchesContainer}>
                {(Object.keys(THEMES) as ThemeName[]).map((name) => {
                  const isSelected = name === themeName;
                  const swatchColor = THEME_SWATCHES[name];
                  const label = THEME_LABELS[name];

                  return (
                    <TouchableOpacity
                      key={name}
                      style={styles.swatchRow}
                      onPress={() => handleSelectTheme(name)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.swatchLeft}>
                        <View
                          style={[
                            styles.swatch,
                            { backgroundColor: swatchColor },
                            isSelected && { borderColor: tokens.text, borderWidth: 2 },
                          ]}
                        >
                          {isSelected && (
                            <View style={[styles.checkBadge, { backgroundColor: tokens.accent }]}>
                              <Check size={12} color="#FFFFFF" strokeWidth={3} />
                            </View>
                          )}
                        </View>
                        <Text style={[styles.label, { color: tokens.text }]}>{label}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </SolidCard>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  container: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h2,
    fontSize: 20,
  },
  swatchesContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  swatchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  label: {
    ...typography.subtitle,
    fontSize: 16,
  },
});
