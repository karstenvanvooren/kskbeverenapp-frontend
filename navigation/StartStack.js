import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { COLORS } from "../constants/theme";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import StartScreen from "../screens/StartScreen";

const Stack = createNativeStackNavigator();

export default function StartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Start"
        component={StartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "", headerTintColor: COLORS.primary }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "", headerTintColor: COLORS.primary }}
      />
    </Stack.Navigator>
  );
}