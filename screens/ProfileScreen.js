import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import ModalHeader from "../components/ModalHeader";
import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

const NOTIFICATIONS_KEY = "ksk_notifications_enabled";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [newsNotifications, setNewsNotifications] = useState(true);

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

  return (
    <View style={styles.screen}>
      <ModalHeader title="Profiel" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.username?.[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>

        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>

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
  username: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 2,
  },
  email: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: SPACING.xxl,
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
});