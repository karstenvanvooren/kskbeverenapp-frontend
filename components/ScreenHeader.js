import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, FONTS, SPACING } from "../constants/theme";


export default function ScreenHeader() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>KSK Beveren</Text>
      <Pressable hitSlop={8} onPress={() => navigation.navigate("Profile")}>
        <Ionicons
          name="person-circle-outline"
          size={30}
          color={COLORS.white}
        />
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
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.accent,
  },
});