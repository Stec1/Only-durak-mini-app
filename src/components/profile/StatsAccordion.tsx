import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useTokens } from '@/src/contexts/theme';
import { tokens } from '@/src/theme/tokens';

type StatsAccordionProps = {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: ReactNode;
  isOpen: boolean;
  onToggle?: () => void;
  showHeader?: boolean;
  children: ReactNode;
};

export default function StatsAccordion({ 
  title, 
  subtitle, 
  value,
  icon,
  isOpen,
  onToggle,
  showHeader = true,
  children
}: StatsAccordionProps) {
  const themeTokens = useTokens();

  const shouldRenderHeader = showHeader !== false;

  const handleToggle = () => {
    if (!shouldRenderHeader || !onToggle) return;
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    onToggle();
  };

  if (!shouldRenderHeader && !isOpen) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: themeTokens.cardBg, borderColor: themeTokens.border }]}>
      {shouldRenderHeader && (
        <TouchableOpacity
          style={styles.header}
          onPress={handleToggle}
          activeOpacity={0.7}
          disabled={!onToggle}
        >
          {icon ? <View style={[styles.iconWrapper, { backgroundColor: themeTokens.bg }]}>
            {icon}
          </View> : null}

          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: themeTokens.text }]}>{title}</Text>
            {subtitle && <Text style={[styles.subtitle, { color: themeTokens.subtext }]}>{subtitle}</Text>}
          </View>

          <View style={styles.headerRight}>
            {value !== undefined && (
              <Text style={[styles.value, { color: themeTokens.text }]}>{value}</Text>
            )}
            <View style={[styles.chevronWrapper, isOpen && styles.chevronOpen]}>
              <ChevronDown color={themeTokens.subtext} size={20} strokeWidth={2.5} />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {isOpen && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: tokens.card.radius,
    borderWidth: 1,
    marginBottom: tokens.spacing.md,
    shadowColor: tokens.card.shadow.color,
    shadowOffset: tokens.card.shadow.offset,
    shadowOpacity: tokens.card.shadow.opacity,
    shadowRadius: tokens.card.shadow.radius,
    elevation: 6,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.bg.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    color: tokens.text.primary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  subtitle: {
    color: tokens.text.secondary,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  value: {
    color: tokens.text.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  chevronWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
    paddingTop: tokens.spacing.xs,
  },
});
