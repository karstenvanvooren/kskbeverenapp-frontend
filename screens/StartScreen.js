import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

export default function StartScreen({ navigation }) {
  const { continueAsGuest } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        {/* TODO: swap for the real crest once we have a transparent PNG/SVG */}
        <View style={styles.crestPlaceholder}>
          <Text style={styles.crestText}>KSK</Text>
        </View>

        <Text style={styles.title}>KSK BEVEREN</Text>
        <Text style={styles.tagline}>
          Nieuws, wedstrijden en je favoriete spelers — alles op één plek.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryButtonText}>Inloggen</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.secondaryButtonText}>Account aanmaken</Text>
        </Pressable>

        <Pressable style={styles.guestLink} onPress={continueAsGuest}>
          <Text style={styles.guestLinkText}>Verder zonder account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xxl,
    paddingTop: 100,
    paddingBottom: 48,
  },
  hero: {
    alignItems: "center",
  },
  crestPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
  },
  crestText: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: COLORS.textOnAccent,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  tagline: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: "#DCE4F7",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  actions: {
    gap: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADII.md,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    fontFamily: FONTS.button,
    fontSize: 16,
    color: COLORS.textOnAccent,
  },
  secondaryButton: {
    borderRadius: RADII.md,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  secondaryButtonText: {
    fontFamily: FONTS.button,
    fontSize: 16,
    color: COLORS.white,
  },
  guestLink: {
    alignItems: "center",
    paddingTop: SPACING.sm,
  },
  guestLinkText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: "#DCE4F7",
    textDecorationLine: "underline",
  },
});