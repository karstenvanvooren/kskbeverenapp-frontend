import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { getNews } from "../services/api";

function formatDate(value) {
  return new Date(value).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NewsScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadNews() {
        try {
          setLoading(true);
          const data = await getNews();
          if (isActive) {
            setArticles(data);
            setError("");
          }
        } catch (loadError) {
          if (isActive) setError(loadError.message);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      loadNews();

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
        <FlatList
          contentContainerStyle={styles.list}
          data={articles}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                navigation.navigate("NewsDetail", { newsId: item._id })
              }
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : null}

              <View style={styles.cardBody}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.summary} numberOfLines={2}>
                  {item.summary}
                </Text>
                <Text style={styles.meta}>
                  {item.author} · {formatDate(item.publishedAt)}
                </Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.errorText}>
                Geen nieuwsartikels gevonden.
              </Text>
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
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    marginBottom: SPACING.lg,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: COLORS.border,
  },
  cardBody: {
    padding: SPACING.md + 2,
  },
  category: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 11,
    color: COLORS.primary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 17,
    color: COLORS.text,
    marginBottom: 6,
  },
  summary: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  meta: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
  },
});