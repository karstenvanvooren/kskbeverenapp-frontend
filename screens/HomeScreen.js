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

function formatShortDate(value) {
  return new Date(value).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "short",
  });
}

function initials(name) {
  return name?.slice(0, 3).toUpperCase() ?? "?";
}

function isWin(match) {
  if (match.status !== "finished") return false;
  return match.home
    ? match.homeScore > match.awayScore
    : match.awayScore > match.homeScore;
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
  const wins = matches.filter(isWin).length;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerBrand}>
          <View style={styles.crestBadge}>
            <Text style={styles.crestBadgeText}>KSK</Text>
          </View>
          <Text style={styles.headerTitle}>KSK Beveren</Text>
        </View>
        <Pressable
          hitSlop={8}
          onPress={() => navigation.navigate("Profile")}
        >
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
          <Text style={styles.matchLabel}>Volgende wedstrijd</Text>

          <View style={styles.matchup}>
            <View style={styles.teamColumn}>
              <View style={styles.teamCircle}>
                <Text style={styles.teamCircleText}>
                  {nextMatch.home ? "KSK" : initials(nextMatch.opponent)}
                </Text>
              </View>
              <Text style={styles.teamLabel}>
                {nextMatch.home ? "KSK" : nextMatch.opponent}
              </Text>
            </View>

            <Text style={styles.vs}>VS</Text>

            <View style={styles.teamColumn}>
              <View style={styles.teamCircle}>
                <Text style={styles.teamCircleText}>
                  {nextMatch.home ? initials(nextMatch.opponent) : "KSK"}
                </Text>
              </View>
              <Text style={styles.teamLabel}>
                {nextMatch.home ? nextMatch.opponent : "KSK"}
              </Text>
            </View>
          </View>

          <Text style={styles.matchMeta}>
            {formatShortDate(nextMatch.date)}, {nextMatch.time} ·{" "}
            {nextMatch.location}
          </Text>
        </Pressable>
      ) : null}

      <View style={styles.statsRow}>
        <StatTile
          icon="football-outline"
          label="Wedstrijden"
          value={matches.length}
        />
        <StatTile
          icon="trophy-outline"
          label="Overwinningen"
          value={wins}
        />
        <StatTile icon="people-outline" label="Spelers" value={players.length} />
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
            style={styles.matchRow}
            onPress={() =>
              navigation.navigate("MatchDetail", { matchId: match._id })
            }
          >
            <View style={styles.matchRowDate}>
              <Text style={styles.matchRowDateText}>
                {formatShortDate(match.date)}
              </Text>
              <Text style={styles.matchRowTimeText}>{match.time}</Text>
            </View>
            <Text style={styles.matchRowTeams} numberOfLines={1}>
              {match.home ? "KSK" : match.opponent}
              {"  vs  "}
              {match.home ? match.opponent : "KSK"}
            </Text>
            <View style={styles.homeTag}>
              <Text style={styles.homeTagText}>
                {match.home ? "Thuis" : "Uit"}
              </Text>
            </View>
          </Pressable>
        ))
      )}

      <SectionHeader
        title="Laatste nieuws"
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
              <Text style={styles.newsCategory}>{article.category}</Text>
              <Text style={styles.newsTitle} numberOfLines={2}>
                {article.title}
              </Text>
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
        <Ionicons name={icon} size={18} color={COLORS.primary} />
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
      <Pressable onPress={onPress}>
        <Text style={styles.sectionLink}>Zie alles</Text>
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
    color: COLORS.danger,
    textAlign: "center",
  },
  container: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingTop: 16,
    paddingBottom: SPACING.xxl,
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  crestBadge: {
    width: 32,
    height: 32,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  crestBadgeText: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    color: COLORS.textOnAccent,
  },
  headerTitle: {
    fontFamily: FONTS.heading,
    fontSize: 17,
    color: COLORS.white,
  },
  matchCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADII.lg,
    padding: SPACING.xl,
    marginHorizontal: SPACING.xl,
    marginTop: -32,
  },
  matchLabel: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 11,
    color: "#B9C6EC",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: SPACING.md,
    letterSpacing: 0.5,
  },
  matchup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.lg,
    marginBottom: SPACING.md,
  },
  teamColumn: {
    alignItems: "center",
    width: 76,
  },
  teamCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  teamCircleText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    color: COLORS.white,
  },
  teamLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.white,
    textAlign: "center",
  },
  vs: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    color: COLORS.accent,
  },
  matchMeta: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: "#DCE4F7",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  statTile: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    padding: SPACING.md,
    alignItems: "flex-start",
  },
  statIconBadge: {
    width: 30,
    height: 30,
    borderRadius: RADII.sm,
    backgroundColor: "#E4E9F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.text,
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
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
    fontSize: 15,
    color: COLORS.text,
  },
  sectionLink: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.primary,
  },
  emptyText: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.xl,
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  matchRowDate: {
    width: 48,
  },
  matchRowDateText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    color: COLORS.text,
  },
  matchRowTimeText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  matchRowTeams: {
    flex: 1,
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: COLORS.text,
  },
  homeTag: {
    backgroundColor: "#E4E9F7",
    borderRadius: RADII.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  homeTagText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 10,
    color: COLORS.primary,
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
  newsCategory: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 10,
    color: COLORS.primary,
    textTransform: "uppercase",
    marginBottom: SPACING.xs,
  },
  newsTitle: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 13,
    color: COLORS.text,
  },
});