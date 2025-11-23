import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle } from 'lucide-react-native';
import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.background.darker, Colors.background.dark]}
          style={styles.background}
        />
        
        <AlertCircle color={Colors.neon.pink} size={64} />
        <Text style={styles.title}>{'404 - Page Not Found'}</Text>
        <Text style={styles.subtitle}>{'This screen doesn\'t exist'}</Text>

        <Link href="/" style={styles.link}>
          <View style={styles.linkButton}>
            <Text style={styles.linkText}>{'Go Back Home'}</Text>
          </View>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.text.primary,
    textShadowColor: Colors.shadow.pink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  link: {
    marginTop: 16,
  },
  linkButton: {
    backgroundColor: Colors.background.glass,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.neon.cyan,
  },
});
