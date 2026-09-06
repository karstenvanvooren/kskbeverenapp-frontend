import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable } from "react-native";

import { COLORS, FONTS } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

function CloseButton({ navigation }) {
  return (
    <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
      <Ionicons name="close" size={26} color={COLORS.primary} />
    </Pressable>
  );
}

// Standard React Navigation "auth flow" pattern: which screens exist in this
// stack depends on login state, so logging in/out automatically swaps them.
export default function ProfileStack() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontFamily: FONTS.heading },
        headerLeft: () => <CloseButton navigation={navigation} />,
      })}
    >
      {isAuthenticated ? (
        <Stack.Screen
          name="ProfileMain"
          component={ProfileScreen}
          options={{ title: "Profiel" }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Inloggen" }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Account aanmaken" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}