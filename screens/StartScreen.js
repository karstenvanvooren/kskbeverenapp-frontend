import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

const logo = require("../assets/images/logo.png");
const leeuw = require("../assets/images/leeuw.png");

export default function StartScreen({ navigation }) {
  const { continueAsGuest } = useAuth();

  return (
    <View style={styles.container}>
      <Image
        source={leeuw}
        style={styles.watermark}
        resizeMode="contain"
        pointerEvents="none"
      />

      <Image source={logo} style={styles.crest} resizeMode="contain" />

      <View style={styles.bottom}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>KSK</Text>
          <Text style={styles.title}>Beveren</Text>
        </View>

        <Text style={styles.tagline}>
          Log in om het laatste nieuws, wedstrijden en community-updates te
          volgen.
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.primaryButtonText}>LOG IN</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.secondaryButtonText}>SIGN UP</Text>
          </Pressable>

          <Pressable style={styles.guestLink} onPress={continueAsGuest}>
            <Text style={styles.guestLinkText}>Verder zonder account</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    overflow: "hidden",
    paddingHorizontal: SPACING.xxl,
    paddingTop: 64,
    paddingBottom: 48,
  },
  watermark: {
    position: "absolute",
    top: -40,
    right: -130,
    width: 380,
    height: 460,
    opacity: 0.16,
  },
  crest: {
    width: 64,
    height: 64,
  },
  bottom: {
    marginTop: "auto",
  },
  titleBlock: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 40,
    lineHeight: 44,
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  tagline: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: "#DCE4F7",
    lineHeight: 20,
    marginBottom: SPACING.xxl,
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
    fontSize: 15,
    letterSpacing: 0.5,
    color: COLORS.textOnAccent,
  },
  secondaryButton: {
    borderRadius: RADII.md,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  secondaryButtonText: {
    fontFamily: FONTS.button,
    fontSize: 15,
    letterSpacing: 0.5,
    color: COLORS.accent,
  },
  guestLink: {
    alignItems: "center",
    paddingTop: SPACING.sm,
  },
  guestLinkText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: "#DCE4F7",
    textDecorationLine: "underline",
  },
});