import '@/utils/logbox';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, ActivityIndicator } from "react-native";
import { AuthContext, useAuth } from "@/contexts/auth";
import { ThemeProvider, useThemeCtx } from "@/src/contexts/theme";
import { useFonts } from 'expo-font';
import { Allura_400Regular } from '@expo-google-fonts/allura';
import { Orbitron_800ExtraBold } from '@expo-google-fonts/orbitron';
import { colors } from '@/constants/tokens';
import { tokens } from '@/src/theme/tokens';
import GradientBackground from '@/components/GradientBackground';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootContent() {
  const { theme } = useThemeCtx();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <GradientBackground />
        <View style={{ flex: 1 }}>
          <RootLayoutNav />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { user, isLoading, dnaAccepted } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inLogin = segments[0] === 'login';
    const inRegister = segments[0] === 'register';
    const inTabs = segments[0] === '(tabs)';

    if (!user && !inRegister) {
      router.replace('/register');
    } else if (user && !dnaAccepted && !inLogin) {
      router.replace('/login');
    } else if (user && dnaAccepted && (inLogin || inRegister)) {
      router.replace('/(tabs)');
    } else if (user && !dnaAccepted && inTabs) {
      router.replace('/login');
    } else if (!user && inTabs) {
      router.replace('/register');
    }
  }, [dnaAccepted, isLoading, router, segments, user]);

  return (
    <Stack 
      screenOptions={{
        headerBackTitle: "Back",
        animation: "fade",
        headerShown: false,
        contentStyle: { backgroundColor: '#0E0F12' },
      }}
    >
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="deck-constructor" options={{ headerShown: true }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen name="game/create" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="game/join" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="game/quick" options={{ headerShown: false }} />
      <Stack.Screen name="game/room" options={{ headerShown: false }} />
      <Stack.Screen name="game/board" options={{ headerShown: false }} />
    </Stack>
  );
}



export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Allura_400Regular,
    Orbitron_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={tokens.bg.base} />
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthContext>
              <RootContent />
            </AuthContext>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </>
  );
}
