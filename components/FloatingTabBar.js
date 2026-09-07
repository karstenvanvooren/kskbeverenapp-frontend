import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, FONTS } from "../constants/theme";

const ICONS = {
  Home: require("../assets/images/icon_home.png"),
  Matches: require("../assets/images/icon_calander.png"),
  News: require("../assets/images/icon_news.png"),
  Team: require("../assets/images/icon_team.png"),
};

const LABELS = {
  Home: "Home",
  Matches: "Wedstrijden",
  News: "Nieuws",
  Team: "Team",
};

export default function FloatingTabBar({ state, navigation }) {
  return (
    <View style={styles.wrap}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        function onPress() {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.button}>
            <Image
              source={ICONS[route.name]}
              style={[styles.icon, { opacity: isFocused ? 1 : 0.6 }]}
              resizeMode="contain"
            />
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {LABELS[route.name]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 22,
    height: 22,
    marginBottom: 2,
  },
  label: {
    fontFamily: FONTS.bodySemiBold,
    fontSize: 11,
    color: COLORS.white,
  },
  labelActive: {
    color: COLORS.accent,
  },
});