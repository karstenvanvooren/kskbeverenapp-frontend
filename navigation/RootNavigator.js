import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { COLORS, FONTS } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import MainTabs from "./MainTabs";
import ProfileStack from "./ProfileStack";
import StartStack from "./StartStack";

const Stack = createNativeStackNavigator();

// First launch (or after logout) shows the branded Start screen. From there
// you can log in, register, or continue as a guest — either way you land on
// MainTabs. Profile no longer lives in the bottom tab bar; it's a modal
// pushed from the top-right icon on the main screens, reachable from
// anywhere via navigation.navigate("Profile") (React Navigation bubbles
// that call up to this root stack automatically).
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
      {canBrowse ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="Profile"
            component={ProfileStack}
            options={{ presentation: "modal" }}
          />
        </Stack.Navigator>
      ) : (
        <StartStack />
      )}
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