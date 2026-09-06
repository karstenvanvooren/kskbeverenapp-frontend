import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { COLORS, FONTS } from "../constants/theme";
import HomeScreen from "../screens/HomeScreen";
import MatchDetailScreen from "../screens/MatchDetailScreen";
import MotmScreen from "../screens/MotmScreen";
import NewsDetailScreen from "../screens/NewsDetailScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontFamily: FONTS.heading },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={{ title: "Wedstrijd" }}
      />
      <Stack.Screen
        name="Motm"
        component={MotmScreen}
        options={{ title: "Man of the Match" }}
      />
      <Stack.Screen
        name="NewsDetail"
        component={NewsDetailScreen}
        options={{ title: "Nieuws" }}
      />
    </Stack.Navigator>
  );
}