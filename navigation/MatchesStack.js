import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { COLORS, FONTS } from "../constants/theme";
import MatchDetailScreen from "../screens/MatchDetailScreen";
import MatchesScreen from "../screens/MatchesScreen";
import MotmScreen from "../screens/MotmScreen";

const Stack = createNativeStackNavigator();

export default function MatchesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontFamily: FONTS.heading },
      }}
    >
      <Stack.Screen
        name="MatchesMain"
        component={MatchesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="Motm"
        component={MotmScreen}
        options={{ title: "Man of the Match" }}
      />
    </Stack.Navigator>
  );
}