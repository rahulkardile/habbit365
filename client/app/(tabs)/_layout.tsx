import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

export default function Layout() {
  const theme = useTheme("light");
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBackground,
          borderTopWidth: 0,
          display: route.name === "(tabs)/home" ? "none" : "flex",
        },
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        sceneStyle: { backgroundColor: theme.background },
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
