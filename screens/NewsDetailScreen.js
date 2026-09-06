import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { COLORS, FONTS, RADII, SPACING } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import {
    addComment,
    deleteComment,
    getComments,
    getNewsArticle,
} from "../services/api";

function formatDate(value) {
  return new Date(value).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCommentDate(value) {
  return new Date(value).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NewsDetailScreen({ route, navigation }) {
  const { newsId } = route.params;
  const { user, isAuthenticated } = useAuth();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [articleData, commentsData] = await Promise.all([
        getNewsArticle(newsId),
        getComments(newsId),
      ]);
      setArticle(articleData);
      setComments(commentsData);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  async function handleAddComment() {
    if (!commentText.trim()) return;

    setPosting(true);

    try {
      await addComment(newsId, user.id, commentText.trim());
      setCommentText("");
      const refreshed = await getComments(newsId);
      setComments(refreshed);
    } catch (postError) {
      setError(postError.message);
    } finally {
      setPosting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await deleteComment(commentId);
      setComments((current) => current.filter((c) => c._id !== commentId));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error && !article) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        contentContainerStyle={styles.list}
        data={comments}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <View>
            {article.image ? (
              <Image source={{ uri: article.image }} style={styles.image} />
            ) : null}

            <View style={styles.body}>
              <Text style={styles.category}>{article.category}</Text>
              <Text style={styles.title}>{article.title}</Text>
              <Text style={styles.meta}>
                {article.author} · {formatDate(article.publishedAt)}
              </Text>
              <Text style={styles.content}>{article.content}</Text>
            </View>

            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>
                Reacties ({comments.length})
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <View style={styles.commentHeaderRow}>
              <Text style={styles.commentAuthor}>
                {item.userId?.username ?? "Onbekend"}
              </Text>
              <Text style={styles.commentDate}>
                {formatCommentDate(item.createdAt)}
              </Text>
            </View>
            <Text style={styles.commentText}>{item.content}</Text>

            {user && item.userId?._id === user.id ? (
              <Pressable onPress={() => handleDeleteComment(item._id)}>
                <Text style={styles.deleteLink}>Verwijderen</Text>
              </Pressable>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noComments}>
            Nog geen reacties. Wees de eerste!
          </Text>
        }
        ListFooterComponent={<View style={{ height: 24 }} />}
      />

      {isAuthenticated ? (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Schrijf een reactie..."
            multiline
          />
          <Pressable
            style={[styles.sendButton, posting && styles.sendButtonDisabled]}
            onPress={handleAddComment}
            disabled={posting}
          >
            <Text style={styles.sendButtonText}>
              {posting ? "..." : "Post"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.loginBanner}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.loginBannerText}>
            Log in om te reageren →
          </Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
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
    paddingBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: COLORS.border,
  },
  body: {
    padding: SPACING.xl,
  },
  category: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 11,
    color: COLORS.primary,
    textTransform: "uppercase",
    marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  meta: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  content: {
    fontFamily: FONTS.body,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
  },
  commentsHeader: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  commentsTitle: {
    fontFamily: FONTS.heading,
    fontSize: 15,
    color: COLORS.text,
  },
  noComments: {
    fontFamily: FONTS.body,
    textAlign: "center",
    color: COLORS.textMuted,
    paddingVertical: SPACING.lg,
  },
  comment: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  commentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentAuthor: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 13,
    color: COLORS.text,
  },
  commentDate: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  commentText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.text,
  },
  deleteLink: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.danger,
    marginTop: SPACING.xs + 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.body,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.pill,
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.sm + 2,
    maxHeight: 100,
    marginRight: SPACING.sm,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.pill,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontFamily: FONTS.button,
    color: COLORS.white,
  },
  loginBanner: {
    padding: SPACING.md + 2,
    backgroundColor: "#EAF0FB",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  loginBannerText: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.primary,
    textAlign: "center",
  },
});