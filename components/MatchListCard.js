import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";

function initials(name) {
  return name?.slice(0, 3).toUpperCase() ?? "?";
}

function formatShortDate(value) {
  return new Date(value).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "short",
  });
}

export default function MatchListCard({ match, onPress }) {
  const isFinished = match.status === "finished";
  const homeTeam = match.home ? "KSK" : initials(match.opponent);
  const awayTeam = match.home ? initials(match.opponent) : "KSK";

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.top}>
        <Text style={styles.date}>
          {formatShortDate(match.date)} • {match.time}
        </Text>
        <View style={[styles.tag, !match.home && styles.tagAway]}>
          <Text style={[styles.tagText, !match.home && styles.tagTextAway]}>
            {match.home ? "Thuis" : "Uit"}
          </Text>
        </View>
      </View>

      <View style={styles.teams}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{homeTeam}</Text>
        </View>

        {isFinished ? (
          <Text style={styles.score}>
            {match.homeScore} - {match.awayScore}
          </Text>
        ) : (
          <Text style={styles.vs}>vs</Text>
        )}

        <View style={styles.chip}>
          <Text style={styles.chipText}>{awayTeam}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  date: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.text,
  },
  tag: {
    backgroundColor: "#FCEFC7",
    borderRadius: RADII.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagAway: {
    backgroundColor: "#E4E9F9",
  },
  tagText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.accentDark,
  },
  tagTextAway: {
    color: COLORS.primary,
  },
  teams: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chip: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.white,
  },
  vs: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
  },
  score: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.primary,
  },
});