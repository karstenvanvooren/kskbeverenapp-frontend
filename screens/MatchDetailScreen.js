import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ModalHeader from "../components/ModalHeader";
import { OWN_TEAM_LOGO, resolveClubLogo } from "../constants/localImages";
import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { getMatch } from "../services/api";

const STATUS_LABELS = {
  upcoming: "Komende wedstrijd",
  live: "Live bezig",
  finished: "Wedstrijd afgelopen",
};

function formatDate(value) {
  return new Date(value).toLocaleDateString("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MatchDetailScreen({ route, navigation }) {
  const { matchId } = route.params;

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadMatch() {
      try {
        const data = await getMatch(matchId);
        if (isActive) setMatch(data);
      } catch (loadError) {
        if (isActive) setError(loadError.message);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadMatch();

    return () => {
      isActive = false;
    };
  }, [matchId]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <ModalHeader title="Wedstrijd" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  if (error || !match) {
    return (
      <View style={styles.screen}>
        <ModalHeader title="Wedstrijd" />
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error || "Wedstrijd niet gevonden."}
          </Text>
        </View>
      </View>
    );
  }

  const homeTeam = match.home ? "KSK Beveren" : match.opponent;
  const awayTeam = match.home ? match.opponent : "KSK Beveren";
  const homeScore = match.home ? match.homeScore : match.awayScore;
  const awayScore = match.home ? match.awayScore : match.homeScore;
  const opponentLogo = resolveClubLogo(match.opponentLogo);
  const homeLogo = match.home ? OWN_TEAM_LOGO : opponentLogo;
  const awayLogo = match.home ? opponentLogo : OWN_TEAM_LOGO;

  return (
    <View style={styles.screen}>
      <ModalHeader title="Wedstrijd" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.status}>
          {STATUS_LABELS[match.status] ?? match.status}
        </Text>

        <View style={styles.matchupBox}>
          <View style={styles.teamColumn}>
            {homeLogo ? (
              <Image
                source={homeLogo}
                style={styles.crest}
                resizeMode="contain"
              />
            ) : null}
            <Text style={styles.teamName}>{homeTeam}</Text>
          </View>

          {match.status === "finished" ? (
            <Text style={styles.score}>
              {homeScore} - {awayScore}
            </Text>
          ) : (
            <Text style={styles.vs}>vs</Text>
          )}

          <View style={styles.teamColumn}>
            {awayLogo ? (
              <Image
                source={awayLogo}
                style={styles.crest}
                resizeMode="contain"
              />
            ) : null}
            <Text style={styles.teamName}>{awayTeam}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <InfoRow label="Competitie" value={match.competition} />
          {match.matchday ? (
            <InfoRow label="Speeldag" value={String(match.matchday)} />
          ) : null}
          <InfoRow label="Datum" value={formatDate(match.date)} />
          <InfoRow label="Aftrap" value={match.time} />
          <InfoRow label="Locatie" value={match.location} />
        </View>

        {match.status === "finished" ? (
          <Pressable
            style={styles.motmButton}
            onPress={() => navigation.navigate("Motm", { matchId: match._id })}
          >
            <Text style={styles.motmButtonText}>⚽ Man of the Match</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  },
  status: {
    textAlign: "center",
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    color: COLORS.primary,
    textTransform: "uppercase",
    marginBottom: SPACING.lg,
  },
  matchupBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.xxl,
  },
  teamColumn: {
    flex: 1,
    alignItems: "center",
  },
  crest: {
    width: 48,
    height: 48,
    marginBottom: SPACING.sm,
    resizeMode: "contain",
  },
  teamName: {
    fontFamily: FONTS.heading,
    fontSize: 15,
    color: COLORS.text,
    textAlign: "center",
  },
  vs: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.md,
  },
  score: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.text,
    marginHorizontal: SPACING.md,
  },
  infoBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  infoLabel: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 14,
    color: COLORS.text,
  },
  motmButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADII.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  motmButtonText: {
    fontFamily: FONTS.button,
    color: COLORS.textOnAccent,
    fontSize: 16,
  },
});