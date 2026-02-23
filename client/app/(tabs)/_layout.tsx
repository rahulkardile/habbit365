import { Stack, Tabs } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

export default function Layout() {
  const theme = useTheme("light");
  return (
    <Stack>
      <Tabs>
        <Tabs.Screen
          name="(tabs)/home"
          options={{ headerShown: false }}
        />

        <Tabs.Screen
          name="(tabs)/analytics"
          options={{ headerShown: false }}
        />

        <Tabs.Screen
          name="(tabs)/leaderboard"
          options={{ headerShown: false }}
        />

        <Tabs.Screen
          name="(tabs)/calendar"
          options={{ headerShown: false }}
        />
      </Tabs>
    </Stack>
  )
}
