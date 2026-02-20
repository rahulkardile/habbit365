import React from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet, useColorScheme, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const theme = useTheme("light");
  const route = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={require("@/assets/habit-illustration.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Welcome to Habbit365!
      </Text>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Discover the power of habit tracking. Stay organized and motivated with Habit365.
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.buttonBackground },
        ]}
        onPress={() => route.push("/home")}
      >
        <Icon name="arrow-right" size={16} color={theme.iconColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: width * 0.9,   // responsive 👌
    height: 350,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 56,
  },
});