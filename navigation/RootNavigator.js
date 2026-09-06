import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { COLORS, FONTS } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import MainTabs from "./MainTabs";
import StartStack from "./StartStack";

// First launch (or after logout) shows the branded Start screen. From there
// you can log in, register, or continue as a guest — either way you land on
// MainTabs. Once past Start, club content stays public; only the Profile
// tab, commenting and MOTM voting ask for an account (see ProfileStack,
// NewsDetailScreen, MotmScreen).
export default function RootNavigator() {
  const { isLoading, canBrowse } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.label}>KSK Beveren laden...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {canBrowse ? <MainTabs /> : <StartStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    gap: 12,
  },
  label: {
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
  },
});