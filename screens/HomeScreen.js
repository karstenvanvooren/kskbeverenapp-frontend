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

import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { getMatches, getNews, getPlayers } from "../services/api";

const logo = require("../assets/images/logo.png");
const leeuwHeader = require("../assets/images/leeuw_header.png");

// TODO: no standings/ranking endpoint exists yet on the backend — this is a
// placeholder until there's a real source for league position.
const LEAGUE_POSITION = "3de";

function formatShortDate(value) {
  return new Date(value).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "short",
  });
}

function formatDayTime(dateValue, time) {
  const day = new Date(dateValue).toLocaleDateString("nl-BE", {
    weekday: "long",
  });
  return `${day.charAt(0).toUpperCase()}${day.slice(1)}, ${time}`;
}

function timeAgo(value) {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Zojuist";
  if (diffHours < 24) return `${diffHours} uur geleden`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ${diffDays === 1 ? "dag" : "dagen"} geleden`;
}

function initials(name) {
  return name?.slice(0, 3).toUpperCase() ?? "?";
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadHome = useCallback(async () => {
    try {
      const [matchesData, playersData, newsData] = await Promise.all([
        getMatches(),
        getPlayers(),
        getNews(),
      ]);

      setMatches(matchesData);
      setPlayers(playersData);
      setLatestNews(newsData.slice(0, 3));
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
              <View style={styles.teamCircle}>
                <Text style={styles.teamCircleText}>
                  {nextMatch.home ? "KSK" : initials(nextMatch.opponent)}
                </Text>
              </View>
              <Text style={styles.vs}>vs</Text>
              <View style={styles.teamCircle}>
                <Text style={styles.teamCircleText}>
                  {nextMatch.home ? initials(nextMatch.opponent) : "KSK"}
                </Text>
              </View>
            </View>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.statsRow}>
        <StatTile icon="trending-up" label="Positie" value={LEAGUE_POSITION} />
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
          <Pressable
            key={match._id}
            style={styles.upcomingCard}
            onPress={() =>
              navigation.navigate("MatchDetail", { matchId: match._id })
            }
          >
            <View style={styles.upcomingCardTop}>
              <Text style={styles.upcomingCardDate}>
                {formatShortDate(match.date)} • {match.time}
              </Text>
              <View style={styles.homeTag}>
                <Text style={styles.homeTagText}>
                  {match.home ? "Thuis" : "Uit"}
                </Text>
              </View>
            </View>

            <View style={styles.upcomingCardTeams}>
              <View style={styles.teamChipSmall}>
                <Text style={styles.teamChipSmallText}>
                  {match.home ? "KSK" : initials(match.opponent)}
                </Text>
              </View>
              <Text style={styles.vsSmall}>vs</Text>
              <View style={styles.teamChipSmall}>
                <Text style={styles.teamChipSmallText}>
                  {match.home ? initials(match.opponent) : "KSK"}
                </Text>
              </View>
            </View>
          </Pressable>
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
          <Pressable
            key={article._id}
            style={styles.newsCard}
            onPress={() =>
              navigation.navigate("NewsDetail", { newsId: article._id })
            }
          >
            {article.image ? (
              <Image
                source={{ uri: article.image }}
                style={styles.newsImage}
              />
            ) : (
              <View style={styles.newsImagePlaceholder} />
            )}
            <View style={styles.newsBody}>
              <Text style={styles.newsTitle} numberOfLines={2}>
                {article.title}
              </Text>
              <Text style={styles.newsTime}>{timeAgo(article.publishedAt)}</Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
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
  upcomingCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  upcomingCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  upcomingCardDate: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.text,
  },
  homeTag: {
    backgroundColor: "#FCEFC7",
    borderRadius: RADII.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  homeTagText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.accentDark,
  },
  upcomingCardTeams: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
  },
  teamChipSmall: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  teamChipSmallText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.primary,
  },
  vsSmall: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
  },
  newsCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
    overflow: "hidden",
  },
  newsImage: {
    width: 72,
    height: 72,
    backgroundColor: COLORS.border,
  },
  newsImagePlaceholder: {
    width: 72,
    height: 72,
    backgroundColor: COLORS.border,
  },
  newsBody: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: "center",
  },
  newsTitle: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 18,
    color: COLORS.text,
  },
  newsTime: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});