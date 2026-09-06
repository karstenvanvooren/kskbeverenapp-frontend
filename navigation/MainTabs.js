import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { COLORS, FONTS } from "../constants/theme";
import HomeStack from "./HomeStack";
import MatchesStack from "./MatchesStack";
import NewsStack from "./NewsStack";
import TeamStack from "./TeamStack";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: "home",
  Matches: "football",
  News: "newspaper",
  Team: "people",
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.bodySemiBold,
          fontSize: 11,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: "Home" }} />
      <Tab.Screen
        name="Matches"
        component={MatchesStack}
        options={{ title: "Wedstrijden" }}
      />
      <Tab.Screen name="News" component={NewsStack} options={{ title: "Nieuws" }} />
      <Tab.Screen name="Team" component={TeamStack} options={{ title: "Team" }} />
    </Tab.Navigator>
  );
}