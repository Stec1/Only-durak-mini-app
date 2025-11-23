import React from 'react';
import { Modal, View, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '@/constants/tokens';

type ODModalProps = {
  visible: boolean;
  children: React.ReactNode;
  onRequestClose?: () => void;
};

export default function ODModal({ visible, children, onRequestClose }: ODModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBlur} />
        <View style={styles.container}>
          <View style={styles.card}>
            <LinearGradient
              colors={[colors.surface, colors.surface2] as const}
              style={styles.gradient}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
              >
                {children}
              </ScrollView>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBlur: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  container: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '85%',
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  gradient: {
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  content: {
    padding: spacing.xl,
  },
});
