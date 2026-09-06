import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      setError("Vul je email en wachtwoord in.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      // Bij succes schakelt de navigatie automatisch naar het profielscherm.
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welkom terug</Text>
        <Text style={styles.subtitle}>
          Log in om te reageren op nieuws, te stemmen op de Man of the Match
          en je profiel te beheren.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="naam@voorbeeld.be"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Wachtwoord</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            placeholder="••••••••"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Inloggen</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.linkRow}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.linkText}>
            Nog geen account? <Text style={styles.linkBold}>Registreer</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    padding: SPACING.xxl,
    justifyContent: "center",
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 26,
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.xxl,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: SPACING.sm - 2,
  },
  input: {
    fontFamily: FONTS.body,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.md,
    fontSize: 16,
    backgroundColor: COLORS.surface,
  },
  error: {
    fontFamily: FONTS.body,
    color: COLORS.danger,
    marginBottom: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.sm,
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: FONTS.button,
    color: COLORS.white,
    fontSize: 16,
  },
  linkRow: {
    marginTop: SPACING.xl,
    alignItems: "center",
  },
  linkText: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
  },
  linkBold: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.primary,
  },
});