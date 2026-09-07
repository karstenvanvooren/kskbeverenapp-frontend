import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import NewsListCard from "../components/NewsListCard";
import ScreenHeader from "../components/ScreenHeader";
import { resolveNewsImage } from "../constants/localImages";
import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { getComments, getNews } from "../services/api";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH - SPACING.xl * 2;
const CARD_GAP = SPACING.md;

function formatDate(value) {
  return new Date(value).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NewsScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadNews() {
        try {
          setLoading(true);
          const data = await getNews();
          if (!isActive) return;

          setArticles(data);
          setError("");
          setLoading(false);

          // Comment counts load in the background so the list shows up
          // right away; "Uitgelicht" just falls back to the newest
          // articles until the counts come in and it re-sorts.
          const counts = await Promise.all(
            data.map((article) =>
              getComments(article._id)
                .then((comments) => [article._id, comments.length])
                .catch(() => [article._id, 0])
            )
          );
          if (isActive) {
            setCommentCounts(Object.fromEntries(counts));
          }
        } catch (loadError) {
          if (isActive) {
            setError(loadError.message);
            setLoading(false);
          }
        }
      }

      loadNews();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const featured = useMemo(() => {
    return [...articles]
      .sort((a, b) => {
        const countDiff =
          (commentCounts[b._id] ?? 0) - (commentCounts[a._id] ?? 0);
        if (countDiff !== 0) return countDiff;
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      })
      .slice(0, 3);
  }, [articles, commentCounts]);

  function handleSlideScrollEnd(event) {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP)
    );
    setActiveSlide(index);
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <ScreenHeader />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <ScreenHeader />
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <FlatList
        contentContainerStyle={styles.list}
        data={articles}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          featured.length === 0 ? null : (
            <View style={styles.featuredSection}>
              <Text style={styles.sectionTitle}>Uitgelicht</Text>

              <FlatList
                data={featured}
                horizontal
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_GAP}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContent}
                ItemSeparatorComponent={() => (
                  <View style={{ width: CARD_GAP }} />
                )}
                onMomentumScrollEnd={handleSlideScrollEnd}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.featuredCard}
                    onPress={() =>
                      navigation.navigate("NewsDetail", { newsId: item._id })
                    }
                  >
                    <View style={styles.featuredImageWrap}>
                      {resolveNewsImage(item.image) ? (
                        <Image
                          source={resolveNewsImage(item.image)}
                          style={styles.featuredImage}
                        />
                      ) : (
                        <View style={styles.featuredImagePlaceholder} />
                      )}

                      <View style={styles.featuredBadgeRow}>
                        <View style={styles.featuredCategory}>
                          <Text style={styles.featuredCategoryText}>
                            {item.category}
                          </Text>
                        </View>
                        <View style={styles.commentBadge}>
                          <Ionicons
                            name="chatbubble-outline"
                            size={14}
                            color={COLORS.white}
                          />
                          <Text style={styles.commentBadgeText}>
                            {commentCounts[item._id] ?? 0}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.featuredBody}>
                      <Text style={styles.featuredTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={styles.featuredMeta}>
                        {item.author} · {formatDate(item.publishedAt)}
                      </Text>
                    </View>
                  </Pressable>
                )}
              />

              {featured.length > 1 ? (
                <View style={styles.dotsRow}>
                  {featured.map((item, index) => (
                    <View
                      key={item._id}
                      style={[
                        styles.dot,
                        index === activeSlide && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              ) : null}

              <Text style={styles.sectionTitle}>Recente nieuws</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <NewsListCard
            article={item}
            onPress={() =>
              navigation.navigate("NewsDetail", { newsId: item._id })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.errorText}>
              Geen nieuwsartikels gevonden.
            </Text>
          </View>
        }
      />
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
  list: {
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.text,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  featuredSection: {
    paddingTop: SPACING.lg,
  },
  carouselContent: {
    paddingHorizontal: SPACING.xl,
  },
  featuredCard: {
    width: CARD_WIDTH,
    borderRadius: RADII.lg,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },
  featuredImageWrap: {
    width: "100%",
    height: 150,
    backgroundColor: COLORS.border,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primaryDark,
  },
  featuredBadgeRow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING.md,
  },
  featuredCategory: {
    backgroundColor: COLORS.accent,
    borderRadius: RADII.pill,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
  },
  featuredCategoryText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    color: COLORS.textOnAccent,
    textTransform: "uppercase",
  },
  commentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: RADII.pill,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
  },
  commentBadgeText: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 12,
    color: COLORS.white,
  },
  featuredBody: {
    padding: SPACING.md + 2,
  },
  featuredTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 4,
  },
  featuredMeta: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: COLORS.primary,
  },
});