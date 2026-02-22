import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

export default function Layout() {
  const theme = useTheme("light");
  return (
    <Tabs >
      <Tabs.Screen
        name="(tabs)/home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="(tabs)/analytics"
        options={{
          title: "Analytics",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(tabs)/leaderboard"
        options={{
          title: "Leaderboard",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(tabs)/calendar"
        options={{
          title: "Calendar",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(tabs)/add-habit"
        options={{
          title: "Add Habit",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
