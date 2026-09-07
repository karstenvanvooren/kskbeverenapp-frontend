import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

import { COLORS, FONTS } from "../constants/theme";
import HomeStack from "./HomeStack";
import MatchesStack from "./MatchesStack";
import NewsStack from "./NewsStack";
import TeamStack from "./TeamStack";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: require("../assets/images/icon_home.png"),
  Matches: require("../assets/images/icon_calander.png"),
  News: require("../assets/images/icon_news.png"),
  Team: require("../assets/images/icon_team.png"),
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
        tabBarIcon: ({ focused, size }) => (
          <Image
            source={ICONS[route.name]}
            style={{
              width: size,
              height: size,
              opacity: focused ? 1 : 0.6,
            }}
            resizeMode="contain"
          />
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