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

import ModalHeader from "../components/ModalHeader";
import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!username || !email || !password || !confirmPassword) {
      setError("Vul alle velden in.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }

    if (password.length < 6) {
      setError("Wachtwoord moet minstens 6 tekens lang zijn.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await register(username.trim(), email.trim(), password);
      // Bij succes log je automatisch in en schakelt de navigatie om.
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.flex}>
      <ModalHeader title="Account aanmaken" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Account aanmaken</Text>
          <Text style={styles.subtitle}>
            Maak een account aan om deel te nemen aan de community van KSK
            Beveren.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Gebruikersnaam</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholder="jouwnaam"
            />
          </View>

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
              placeholder="••••••••"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Bevestig wachtwoord</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="••••••••"
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Registreren</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.linkRow}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.linkText}>
              Heb je al een account?{" "}
              <Text style={styles.linkBold}>Log in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: SPACING.xxl,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
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
    fontSize: 16,
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
    fontFamily: FONTS.heading,
    color: COLORS.white,
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  linkRow: {
    marginTop: SPACING.xl,
    alignItems: "center",
  },
  linkText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
  },
  linkBold: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.primary,
  },
});