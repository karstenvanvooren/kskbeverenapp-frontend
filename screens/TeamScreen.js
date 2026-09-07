import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import { resolvePlayerImage } from "../constants/localImages";
import { COLORS, FONTS, SPACING } from "../constants/theme";
import { getPlayers } from "../services/api";

const POSITION_ORDER = [
  "Doelman",
  "Verdediger",
  "Middenvelder",
  "Aanvaller",
];

const FILTERS = [
  { key: "Alle", label: "Alle" },
  { key: "Doelman", label: "Doelmannen" },
  { key: "Verdediger", label: "Verdedigers" },
  { key: "Middenvelder", label: "Middenvelders" },
  { key: "Aanvaller", label: "Aanvallers" },
];

function groupByPosition(players, positions) {
  return positions
    .map((position) => ({
      title: position,
      data: players.filter((player) => player.position === position),
    }))
    .filter((section) => section.data.length > 0);
}

export default function TeamScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadPlayers() {
        try {
          setLoading(true);
          const data = await getPlayers();
          if (isActive) {
            setPlayers(data);
            setError("");
          }
        } catch (loadError) {
          if (isActive) {
            setError(loadError.message);
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      loadPlayers();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const sections = useMemo(() => {
    const positions =
      activeFilter === "Alle" ? POSITION_ORDER : [activeFilter];
    return groupByPosition(players, positions);
  }, [players, activeFilter]);

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabRow}
      >
        {FILTERS.map((filter) => (
          <Pressable
            key={filter.key}
            onPress={() => setActiveFilter(filter.key)}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                activeFilter === filter.key && styles.tabTextActive,
              ]}
            >
              {filter.label}
            </Text>
            <View
              style={[
                styles.tabUnderline,
                activeFilter !== filter.key && styles.tabUnderlineHidden,
              ]}
            />
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <SectionList
          contentContainerStyle={styles.list}
          sections={sections}
          stickySectionHeadersEnabled={false}
          keyExtractor={(item) => item._id}
          renderSectionHeader={({ section }) =>
            activeFilter === "Alle" ? (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() =>
                navigation.navigate("PlayerDetail", { playerId: item._id })
              }
            >
              <Image
                source={resolvePlayerImage(item.image)}
                style={styles.avatar}
              />

              <View style={styles.rowText}>
                <Text style={styles.playerName}>
                  {item.firstName} {item.lastName}
                </Text>
                {item.number ? (
                  <Text style={styles.playerNumber}>#{item.number}</Text>
                ) : null}
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.errorText}>Geen spelers gevonden.</Text>
            </View>
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
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.danger,
    textAlign: "center",
  },
  tabScroll: {
    flexGrow: 0,
    backgroundColor: COLORS.background,
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
  tabUnderlineHidden: {
    backgroundColor: "transparent",
  },
  list: {
    paddingBottom: 24,
    backgroundColor: COLORS.background,
  },
  sectionHeader: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.border,
    resizeMode: "cover",
  },
  rowText: {
    marginLeft: SPACING.md,
  },
  playerName: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.text,
  },
  playerNumber: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
  },
});