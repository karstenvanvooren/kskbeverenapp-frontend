import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ModalHeader from "../components/ModalHeader";
import { resolvePlayerImage } from "../constants/localImages";
import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { getPlayer } from "../services/api";

function formatBirthDate(value) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PlayerDetailScreen({ route }) {
  const { playerId } = route.params;

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadPlayer() {
      try {
        const data = await getPlayer(playerId);
        if (isActive) setPlayer(data);
      } catch (loadError) {
        if (isActive) setError(loadError.message);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadPlayer();

    return () => {
      isActive = false;
    };
  }, [playerId]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <ModalHeader title="Speler" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  if (error || !player) {
    return (
      <View style={styles.screen}>
        <ModalHeader title="Speler" />
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error || "Speler niet gevonden."}
          </Text>
        </View>
      </View>
    );
  }

  const birthDate = formatBirthDate(player.birthDate);

  return (
    <View style={styles.screen}>
      <ModalHeader title="Speler" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            source={resolvePlayerImage(player.image)}
            style={styles.avatar}
          />

          <Text style={styles.name}>
            {player.firstName} {player.lastName}
          </Text>
          <Text style={styles.position}>{player.position}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Rugnummer</Text>
            <Text style={styles.statValue}>{player.number ?? "-"}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Geboortedatum</Text>
            <Text style={styles.statValue}>{birthDate ?? "-"}</Text>
          </View>
        </View>

        {player.bio ? (
          <View style={styles.bioBox}>
            <Text style={styles.bioTitle}>Over {player.firstName}</Text>
            <Text style={styles.bioText}>{player.bio}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontFamily: FONTS.body,
    color: COLORS.danger,
    textAlign: "center",
  },
  container: {
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
    resizeMode: "cover",
  },
  name: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.text,
  },
  position: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    color: COLORS.primary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    padding: SPACING.md + 2,
    alignItems: "center",
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.text,
  },
  bioBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    padding: SPACING.lg,
  },
  bioTitle: {
    fontFamily: FONTS.heading,
    fontSize: 15,
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  bioText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
  },
});