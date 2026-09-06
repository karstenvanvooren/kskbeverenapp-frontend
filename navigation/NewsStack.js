import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { COLORS, FONTS } from "../constants/theme";
import NewsDetailScreen from "../screens/NewsDetailScreen";
import NewsScreen from "../screens/NewsScreen";

const Stack = createNativeStackNavigator();

export default function NewsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontFamily: FONTS.heading },
      }}
    >
      <Stack.Screen
        name="NewsMain"
        component={NewsScreen}
        options={{ title: "Nieuws" }}
      />
      <Stack.Screen
        name="NewsDetail"
        component={NewsDetailScreen}
        options={{ title: "Artikel" }}
      />
    </Stack.Navigator>
  );
}