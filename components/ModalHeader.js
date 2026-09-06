import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, FONTS, SPACING } from "../constants/theme";


export default function ModalHeader({ title }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={26} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  title: {
    flex: 1,
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.accent,
    marginRight: SPACING.md,
  },
});