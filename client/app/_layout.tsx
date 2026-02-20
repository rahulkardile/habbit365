import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0F172A",
          borderTopWidth: 0,
          display: route.name === "(tabs)/home" ? "none" : "flex",
        },
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#94A3B8",
        sceneStyle: { backgroundColor: "#0F172A" },
      })}
    >
      <Tabs.Screen
        name="(tabs)/welcomeScreen"
        options={{
          title: "",
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(tabs)/home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
