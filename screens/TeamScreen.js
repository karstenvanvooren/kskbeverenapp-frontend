import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    SectionList,
    StyleSheet,
    Text,
    View,
} from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import { COLORS, FONTS, SPACING } from "../constants/theme";
import { getPlayers } from "../services/api";

const POSITION_ORDER = [
  "Doelman",
  "Verdediger",
  "Middenvelder",
  "Aanvaller",
];

function groupByPosition(players) {
  return POSITION_ORDER.map((position) => ({
    title: position,
    data: players.filter((player) => player.position === position),
  })).filter((section) => section.data.length > 0);
}

export default function TeamScreen({ navigation }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadPlayers() {
        try {
          setLoading(true);
          const players = await getPlayers();
          if (isActive) {
            setSections(groupByPosition(players));
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

  return (
    <View style={styles.screen}>
      <ScreenHeader />

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
          keyExtractor={(item) => item._id}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() =>
                navigation.navigate("PlayerDetail", { playerId: item._id })
              }
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarFallbackText}>
                    {item.number ?? "?"}
                  </Text>
                </View>
              )}

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
    color: COLORS.danger,
    textAlign: "center",
  },
  list: {
    paddingBottom: 24,
    backgroundColor: COLORS.background,
  },
  sectionHeader: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    fontFamily: FONTS.bodySemiBold,
    fontSize: 13,
    color: COLORS.primary,
    textTransform: "uppercase",
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
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.white,
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
    fontSize: 13,
    color: COLORS.textMuted,
  },
});