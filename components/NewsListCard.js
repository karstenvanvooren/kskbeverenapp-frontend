import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { resolveNewsImage } from "../constants/localImages";
import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";

function formatDate(value) {
  return new Date(value).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NewsListCard({ article, onPress }) {
  const imageSource = resolveNewsImage(article.image);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrap}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.category}>{article.category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        {article.summary ? (
          <Text style={styles.summary} numberOfLines={2}>
            {article.summary}
          </Text>
        ) : null}
        <Text style={styles.meta}>
          {article.author} · {formatDate(article.publishedAt)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    overflow: "hidden",
  },
  imageWrap: {
    width: 120,
    height: 160,
    backgroundColor: COLORS.border,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  body: {
    flex: 1,
    padding: SPACING.md + 2,
  },
  category: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 16,
    color: COLORS.primary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 4,
  },
  summary: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  meta: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textMuted,
  },
});