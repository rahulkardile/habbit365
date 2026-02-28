import { Stack, Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="leaderboard" />
      <Stack.Screen name="calendar" />
    </Stack>
  );
}