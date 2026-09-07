import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import ModalHeader from "../components/ModalHeader";
import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { getPlayers } from "../services/api";

const NOTIFICATIONS_KEY = "ksk_notifications_enabled";

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();

  const [username, setUsername] = useState(user?.username ?? "");
  const [players, setPlayers] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [newsNotifications, setNewsNotifications] = useState(true);

  useEffect(() => {
    getPlayers()
      .then(setPlayers)
      .catch(() => {
        // Favoriete-spelerkeuze is optioneel, negeer stil bij een netwerkfout.
      });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(NOTIFICATIONS_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw);
        setNotificationsEnabled(saved.enabled ?? true);
        setMatchNotifications(saved.matches ?? true);
        setNewsNotifications(saved.news ?? true);
      })
      .catch(() => {
        // Geen opgeslagen voorkeur, ga uit van de standaardwaarden.
      });
  }, []);

  function persistNotificationPrefs(next) {
    AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next)).catch(
      () => {
        // Voorkeur kon niet lokaal opgeslagen worden, negeer stil.
      }
    );
  }

  function handleToggleNotifications(value) {
    setNotificationsEnabled(value);
    persistNotificationPrefs({
      enabled: value,
      matches: matchNotifications,
      news: newsNotifications,
    });
  }

  function handleToggleMatchNotifications(value) {
    setMatchNotifications(value);
    persistNotificationPrefs({
      enabled: notificationsEnabled,
      matches: value,
      news: newsNotifications,
    });
  }

  function handleToggleNewsNotifications(value) {
    setNewsNotifications(value);
    persistNotificationPrefs({
      enabled: notificationsEnabled,
      matches: matchNotifications,
      news: value,
    });
  }

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
    <View style={styles.screen}>
      <ModalHeader title="Profiel" />
      <ScrollView contentContainerStyle={styles.container}>
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

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Meldingen</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Pushmeldingen</Text>
              <Text style={styles.settingDescription}>
                Zet alle meldingen aan of uit.
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>

          <View
            style={[
              styles.settingRow,
              !notificationsEnabled && styles.settingRowDisabled,
            ]}
          >
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Wedstrijduitslagen</Text>
              <Text style={styles.settingDescription}>
                Melding bij de uitslag van elke wedstrijd.
              </Text>
            </View>
            <Switch
              value={matchNotifications}
              onValueChange={handleToggleMatchNotifications}
              disabled={!notificationsEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>

          <View
            style={[
              styles.settingRow,
              styles.settingRowLast,
              !notificationsEnabled && styles.settingRowDisabled,
            ]}
          >
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Nieuwe artikels</Text>
              <Text style={styles.settingDescription}>
                Melding bij nieuw nieuws over de club.
              </Text>
            </View>
            <Switch
              value={newsNotifications}
              onValueChange={handleToggleNewsNotifications}
              disabled={!notificationsEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Uitloggen</Text>
        </Pressable>
      </ScrollView>

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
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
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
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: SPACING.xxl,
  },
  field: {
    width: "100%",
    marginBottom: SPACING.xl,
  },
  label: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
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
    fontSize: 16,
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
    fontSize: 16,
    color: COLORS.text,
  },
  favoriteChange: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.primary,
    fontSize: 16,
  },
  success: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.success,
    marginBottom: SPACING.sm,
  },
  error: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.danger,
    marginBottom: SPACING.sm,
  },
  settingsSection: {
    width: "100%",
    marginTop: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.text,
    marginBottom: SPACING.md,
    alignSelf: "flex-start",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADII.sm,
    borderTopRightRadius: RADII.sm,
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  settingRowLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: RADII.sm,
    borderBottomRightRadius: RADII.sm,
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
  settingText: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.text,
  },
  settingDescription: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: 2,
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
    fontSize: 16,
    color: COLORS.text,
  },
  modalRowMeta: {
    fontFamily: FONTS.body,
    fontSize: 16,
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