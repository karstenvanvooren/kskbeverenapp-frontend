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

import MatchListCard from "../components/MatchListCard";
import ScreenHeader from "../components/ScreenHeader";
import { COLORS, FONTS, SPACING } from "../constants/theme";
import { getMatches } from "../services/api";

const TABS = [
  { key: "upcoming", label: "Wedstrijden" },
  { key: "finished", label: "Uitslagen" },
];

export default function MatchesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("upcoming");
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

  const filteredMatches =
    activeTab === "finished"
      ? matches.filter((match) => match.status === "finished")
      : matches.filter((match) => match.status !== "finished");

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            {activeTab === tab.key ? (
              <View style={styles.tabUnderline} />
            ) : null}
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={filteredMatches}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <MatchListCard
              match={item}
              onPress={() =>
                navigation.navigate("MatchDetail", { matchId: item._id })
              }
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {activeTab === "finished"
                ? "Nog geen gespeelde wedstrijden."
                : "Geen komende wedstrijden."}
            </Text>
          }
        />
      )}
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
  },
  errorText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.danger,
    textAlign: "center",
  },
  tabRow: {
    flexDirection: "row",
    gap: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  tabButton: {
    paddingBottom: SPACING.sm,
  },
  tabText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.text,
  },
  tabUnderline: {
    marginTop: SPACING.xs,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
  list: {
    paddingTop: SPACING.sm,
    paddingBottom: 120,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: SPACING.xxl,
  },
});