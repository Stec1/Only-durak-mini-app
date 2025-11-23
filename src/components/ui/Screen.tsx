import React from 'react';
import { View, ScrollView, ViewProps } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = ViewProps & { scroll?: boolean };

export default function Screen({ children, scroll, style, ...rest }: Props) {
  const insets = useSafeAreaInsets();
  const Container: any = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0E0F12' }} edges={['left', 'right', 'bottom']}>
      <View style={{ height: insets.top, backgroundColor: '#0E0F12' }} />
      <Container style={[{ flex: 1, backgroundColor: '#0E0F12' }, style]} {...rest}>
        {children}
      </Container>
    </SafeAreaView>
  );
}
