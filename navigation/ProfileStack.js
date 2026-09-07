import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

// Standard React Navigation "auth flow" pattern: which screens exist in this
// stack depends on login state, so logging in/out automatically swaps them.
// Every screen renders its own ModalHeader (blue background, yellow title,
// X close button) instead of the native stack header, matching MatchDetail/
// NewsDetail/PlayerDetail.
export default function ProfileStack() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}