import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { COLORS, FONTS } from "../constants/theme";
import PlayerDetailScreen from "../screens/PlayerDetailScreen";
import TeamScreen from "../screens/TeamScreen";

const Stack = createNativeStackNavigator();

export default function TeamStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontFamily: FONTS.heading },
      }}
    >
      <Stack.Screen
        name="TeamMain"
        component={TeamScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlayerDetail"
        component={PlayerDetailScreen}
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}