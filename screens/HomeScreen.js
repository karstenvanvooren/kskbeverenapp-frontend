import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MatchListCard from "../components/MatchListCard";
import NewsListCard from "../components/NewsListCard";
import { OWN_TEAM_LOGO, resolveClubLogo } from "../constants/localImages";
import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { getMatches, getNews, getPlayers, getStandings } from "../services/api";

const logo = require("../assets/images/logo.png");
const leeuwHeader = require("../assets/images/leeuw_header.png");

const OWN_TEAM_NAME = "KSK Beveren";

function formatOrdinal(position) {
  if (position === 1 || position === 8) {
    return `${position}ste`;
  }
  return `${position}de`;
}

function formatDayTime(dateValue, time) {
  const day = new Date(dateValue).toLocaleDateString("nl-BE", {
    weekday: "long",
  });
  return `${day.charAt(0).toUpperCase()}${day.slice(1)}, ${time}`;
}

function initials(name) {
  return name?.slice(0, 3).toUpperCase() ?? "?";
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [leaguePosition, setLeaguePosition] = useState("-");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadHome = useCallback(async () => {
    try {
      const [matchesData, playersData, newsData, standingsData] =
        await Promise.all([
          getMatches(),
          getPlayers(),
          getNews(),
          getStandings(),
        ]);

      setMatches(matchesData);
      setPlayers(playersData);
      setLatestNews(newsData.slice(0, 3));

      const ownStanding = standingsData.find(
        (team) => team.team === OWN_TEAM_NAME
      );
      setLeaguePosition(
        ownStanding ? formatOrdinal(ownStanding.position) : "-"
      );

      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHome();
    }, [loadHome])
  );

  function handleRefresh() {
    setRefreshing(true);
    loadHome();
  }

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

  const upcoming = matches.filter((match) => match.status === "upcoming");
  const nextMatch = upcoming[0] ?? null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
        <Image
          source={leeuwHeader}
          style={styles.heroWatermark}
          resizeMode="cover"
          pointerEvents="none"
        />

        <View style={styles.heroTopRow}>
          <Image source={logo} style={styles.headerCrest} resizeMode="contain" />
          <Pressable hitSlop={8} onPress={() => navigation.navigate("Profile")}>
            <Ionicons
              name="person-circle-outline"
              size={30}
              color={COLORS.white}
            />
          </Pressable>
        </View>

        {nextMatch ? (
          <Pressable
            style={styles.matchCard}
            onPress={() =>
              navigation.navigate("MatchDetail", { matchId: nextMatch._id })
            }
          >
            <View style={styles.matchCardHeader}>
              <Text style={styles.matchLabel}>Volgende wedstrijd</Text>
              <Text style={styles.matchDate}>
                {formatDayTime(nextMatch.date, nextMatch.time)}
              </Text>
            </View>

            <View style={styles.matchup}>
              <TeamCircle
                logo={
                  nextMatch.home
                    ? OWN_TEAM_LOGO
                    : resolveClubLogo(nextMatch.opponentLogo)
                }
                label={nextMatch.home ? "KSK" : initials(nextMatch.opponent)}
              />
              <Text style={styles.vs}>vs</Text>
              <TeamCircle
                logo={
                  nextMatch.home
                    ? resolveClubLogo(nextMatch.opponentLogo)
                    : OWN_TEAM_LOGO
                }
                label={nextMatch.home ? initials(nextMatch.opponent) : "KSK"}
              />
            </View>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.statsRow}>
        <StatTile icon="trending-up" label="Positie" value={leaguePosition} />
        <StatTile
          icon="calendar-outline"
          label="Wedstrijden"
          value={matches.length}
        />
        <StatTile icon="people" label="Spelers" value={players.length} />
      </View>

      <SectionHeader
        title="Komende wedstrijden"
        onPress={() => navigation.navigate("Matches")}
      />
      {upcoming.length === 0 ? (
        <Text style={styles.emptyText}>Geen komende wedstrijden.</Text>
      ) : (
        upcoming.slice(0, 3).map((match) => (
          <MatchListCard
            key={match._id}
            match={match}
            onPress={() =>
              navigation.navigate("MatchDetail", { matchId: match._id })
            }
          />
        ))
      )}

      <SectionHeader
        title="Het laatste nieuws"
        onPress={() => navigation.navigate("News")}
      />
      {latestNews.length === 0 ? (
        <Text style={styles.emptyText}>Geen nieuwsartikels gevonden.</Text>
      ) : (
        latestNews.map((article) => (
          <NewsListCard
            key={article._id}
            article={article}
            onPress={() =>
              navigation.navigate("NewsDetail", { newsId: article._id })
            }
          />
        ))
      )}
    </ScrollView>
  );
}

// Shows the club crest in the hero "next match" card when one is
// available, falling back to the translucent initials circle otherwise.
function TeamCircle({ logo, label }) {
  if (logo) {
    return (
      <View style={styles.teamCircleLogo}>
        <Image
          source={logo}
          style={styles.teamCircleLogoImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.teamCircle}>
      <Text style={styles.teamCircleText}>{label}</Text>
    </View>
  );
}

function StatTile({ icon, label, value }) {
  return (
    <View style={styles.statTile}>
      <View style={styles.statIconBadge}>
        <Ionicons name={icon} size={24} color={COLORS.accent} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SectionHeader({ title, onPress }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text style={styles.sectionLink}>Zie alles ›</Text>
      </Pressable>
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
    padding: 20,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.danger,
    textAlign: "center",
  },
  container: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
    overflow: "hidden",
  },
  heroWatermark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  headerCrest: {
    width: 60,
    height: 60,
  },
  matchCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADII.lg,
    padding: SPACING.xl,
  },
  matchCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  matchLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  matchDate: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.white,
  },
  matchup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  teamCircleText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.white,
  },
  teamCircleLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  teamCircleLogoImage: {
    width: "100%",
    height: "100%",
  },
  vs: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: "#B9C6EC",
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  statTile: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  statIconBadge: {
    width: 40,
    height: 40,
    borderRadius: RADII.sm,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.white,
    textAlign: "center",
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: "#DCE4F7",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.text,
  },
  sectionLink: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.accentDark,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.xl,
  },
});