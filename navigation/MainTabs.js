import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FloatingTabBar from "../components/FloatingTabBar";
import HomeStack from "./HomeStack";
import MatchesStack from "./MatchesStack";
import NewsStack from "./NewsStack";
import TeamStack from "./TeamStack";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
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