import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { getMatches } from "../services/api";

const STATUS_LABELS = {
  upcoming: "Komend",
  live: "Live",
  finished: "Gespeeld",
};

function formatDate(value) {
  return new Date(value).toLocaleDateString("nl-BE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function MatchesScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadMatches() {
        try {
          setLoading(true);
          const data = await getMatches();
          if (isActive) {
            setMatches(data);
            setError("");
          }
        } catch (loadError) {
          if (isActive) setError(loadError.message);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      loadMatches();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={matches}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() =>
            navigation.navigate("MatchDetail", { matchId: item._id })
          }
        >
          <View style={styles.cardTop}>
            <Text style={styles.competition}>{item.competition}</Text>
            <View
              style={[
                styles.statusBadge,
                item.status === "finished" && styles.statusFinished,
                item.status === "live" && styles.statusLive,
              ]}
            >
              <Text style={styles.statusText}>
                {STATUS_LABELS[item.status] ?? item.status}
              </Text>
            </View>
          </View>

          <View style={styles.cardMain}>
            <Text style={styles.matchup}>
              {item.home ? "KSK Beveren" : item.opponent}
              {"  vs  "}
              {item.home ? item.opponent : "KSK Beveren"}
            </Text>

            {item.status === "finished" ? (
              <Text style={styles.score}>
                {item.home ? item.homeScore : item.awayScore} -{" "}
                {item.home ? item.awayScore : item.homeScore}
              </Text>
            ) : null}
          </View>

          <View style={styles.cardBottom}>
            <Text style={styles.meta}>
              {formatDate(item.date)} · {item.time}
            </Text>
            <Text style={styles.meta}>{item.location}</Text>
          </View>
        </Pressable>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.errorText}>Geen wedstrijden gevonden.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: {
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
  list: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  competition: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    color: COLORS.textMuted,
    textTransform: "uppercase",
  },
  statusBadge: {
    backgroundColor: COLORS.border,
    borderRadius: RADII.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusFinished: {
    backgroundColor: "#DBEAD9",
  },
  statusLive: {
    backgroundColor: "#FBE2E2",
  },
  statusText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 11,
    color: COLORS.text,
  },
  cardMain: {
    marginBottom: SPACING.sm,
  },
  matchup: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.text,
  },
  score: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.primary,
    marginTop: 4,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.textMuted,
  },
});