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
import { useAuth } from "../context/AuthContext";
import {
    getMatch,
    getMomResults,
    getMomVotes,
    getPlayers,
    voteForMom,
} from "../services/api";

export default function MotmScreen({ route, navigation }) {
  const { matchId } = route.params;
  const { user, isAuthenticated } = useAuth();

  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [results, setResults] = useState({ totalVotes: 0, results: [] });
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [matchData, playersData, votesData, resultsData] =
        await Promise.all([
          getMatch(matchId),
          getPlayers(),
          getMomVotes(matchId),
          getMomResults(matchId),
        ]);

      setMatch(matchData);
      setPlayers(playersData);
      setResults(resultsData);

      const votedAlready = votesData.some(
        (vote) => user && vote.userId?._id === user.id
      );
      setHasVoted(votedAlready);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [matchId, user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  async function handleVote(playerId) {
    if (!isAuthenticated) {
      navigation.navigate("Profile");
      return;
    }

    setVoting(true);
    setNotice("");

    try {
      await voteForMom(matchId, playerId, user.id);
      setHasVoted(true);
      const refreshedResults = await getMomResults(matchId);
      setResults(refreshedResults);
    } catch (voteError) {
      setNotice(voteError.message);
      if (voteError.message?.toLowerCase().includes("al gestemd")) {
        setHasVoted(true);
      }
    } finally {
      setVoting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !match) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error || "Wedstrijd niet gevonden."}
        </Text>
      </View>
    );
  }

  if (match.status !== "finished") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Je kan pas stemmen zodra de wedstrijd afgelopen is.
        </Text>
      </View>
    );
  }

  const opponentLabel = match.home
    ? `KSK Beveren - ${match.opponent}`
    : `${match.opponent} - KSK Beveren`;

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{opponentLabel}</Text>

      {!isAuthenticated ? (
        <Pressable
          style={styles.loginBanner}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.loginBannerText}>
            Log in om te stemmen op de Man of the Match →
          </Text>
        </Pressable>
      ) : null}

      {notice ? <Text style={styles.notice}>{notice}</Text> : null}

      {isAuthenticated && !hasVoted ? (
        <Text style={styles.sectionTitle}>Kies jouw Man of the Match</Text>
      ) : (
        <Text style={styles.sectionTitle}>
          {hasVoted ? "Bedankt voor je stem! Huidige stand:" : "Huidige stand"}
        </Text>
      )}

      {isAuthenticated && !hasVoted ? (
        <FlatList
          data={players}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.playerRow}
              disabled={voting}
              onPress={() => handleVote(item._id)}
            >
              <Text style={styles.playerName}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.playerPosition}>{item.position}</Text>
            </Pressable>
          )}
        />
      ) : (
        <FlatList
          data={results.results}
          keyExtractor={(item) => item.player.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.errorText}>Nog geen stemmen.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.resultRow}>
              <View style={styles.resultHeader}>
                <Text style={styles.playerName}>
                  {item.player.firstName} {item.player.lastName}
                </Text>
                <Text style={styles.resultPercentage}>
                  {item.percentage}%
                </Text>
              </View>
              <View style={styles.barBackground}>
                <View
                  style={[styles.barFill, { width: `${item.percentage}%` }]}
                />
              </View>
              <Text style={styles.voteCount}>
                {item.votes} {item.votes === 1 ? "stem" : "stemmen"}
              </Text>
            </View>
          )}
          ListFooterComponent={
            results.results.length > 0 ? (
              <Text style={styles.totalVotes}>
                Totaal aantal stemmen: {results.totalVotes}
              </Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    flex: 1,
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  subtitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  loginBanner: {
    backgroundColor: "#EAF0FB",
    borderRadius: RADII.sm,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  loginBannerText: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.primary,
    textAlign: "center",
  },
  notice: {
    fontFamily: FONTS.body,
    color: COLORS.danger,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  list: {
    paddingBottom: 24,
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADII.sm,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  playerName: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 15,
    color: COLORS.text,
  },
  playerPosition: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  resultRow: {
    marginBottom: SPACING.lg,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  resultPercentage: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.primary,
  },
  barBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    backgroundColor: COLORS.primary,
  },
  voteCount: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  totalVotes: {
    fontFamily: FONTS.body,
    textAlign: "center",
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
});