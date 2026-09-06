import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { getPlayers } from "../services/api";

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();

  const [username, setUsername] = useState(user?.username ?? "");
  const [players, setPlayers] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getPlayers()
      .then(setPlayers)
      .catch(() => {
        // Favoriete-spelerkeuze is optioneel, negeer stil bij een netwerkfout.
      });
  }, []);

  const favoritePlayer = players.find(
    (player) => player._id === user?.favoritePlayerId
  );

  async function handleSaveUsername() {
    if (!username.trim() || username.trim() === user.username) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await updateProfile({ username: username.trim() });
      setMessage("Gebruikersnaam bijgewerkt.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePickFavorite(playerId) {
    setPickerVisible(false);
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await updateProfile({ favoritePlayerId: playerId });
      setMessage("Favoriete speler bijgewerkt.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.username?.[0]?.toUpperCase() ?? "?"}
        </Text>
      </View>

      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Gebruikersnaam</Text>
        <View style={styles.usernameRow}>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Pressable
            style={styles.saveButton}
            onPress={handleSaveUsername}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>Opslaan</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Favoriete speler</Text>
        <Pressable
          style={styles.favoriteRow}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={styles.favoriteName}>
            {favoritePlayer
              ? `${favoritePlayer.firstName} ${favoritePlayer.lastName}`
              : "Kies een favoriete speler"}
          </Text>
          <Text style={styles.favoriteChange}>Wijzigen</Text>
        </Pressable>
      </View>

      {saving ? <ActivityIndicator color={COLORS.primary} /> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Uitloggen</Text>
      </Pressable>

      <Modal visible={pickerVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Kies je favoriete speler</Text>
          <FlatList
            data={players}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.modalRow}
                onPress={() => handlePickFavorite(item._id)}
              >
                <Text style={styles.modalRowText}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.modalRowMeta}>{item.position}</Text>
              </Pressable>
            )}
          />
          <Pressable
            style={styles.modalClose}
            onPress={() => setPickerVisible(false)}
          >
            <Text style={styles.modalCloseText}>Sluiten</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xxl,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  avatarText: {
    fontFamily: FONTS.display,
    color: COLORS.white,
    fontSize: 32,
  },
  email: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    marginBottom: SPACING.xxl,
  },
  field: {
    width: "100%",
    marginBottom: SPACING.xl,
  },
  label: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 13,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  usernameRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.body,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.sm + 2,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.lg,
    justifyContent: "center",
  },
  saveButtonText: {
    fontFamily: FONTS.button,
    color: COLORS.white,
  },
  favoriteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADII.sm,
    padding: SPACING.md + 2,
  },
  favoriteName: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    color: COLORS.text,
  },
  favoriteChange: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.primary,
    fontSize: 13,
  },
  success: {
    fontFamily: FONTS.body,
    color: COLORS.success,
    marginBottom: SPACING.sm,
  },
  error: {
    fontFamily: FONTS.body,
    color: COLORS.danger,
    marginBottom: SPACING.sm,
  },
  logoutButton: {
    marginTop: "auto",
    width: "100%",
    borderRadius: RADII.sm,
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  logoutButtonText: {
    fontFamily: FONTS.button,
    color: COLORS.danger,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  modalTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    marginBottom: SPACING.lg,
    color: COLORS.text,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.md + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  modalRowText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    color: COLORS.text,
  },
  modalRowMeta: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  modalClose: {
    paddingVertical: SPACING.lg,
    alignItems: "center",
  },
  modalCloseText: {
    fontFamily: FONTS.button,
    color: COLORS.primary,
  },
});