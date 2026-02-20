import { useColorScheme } from "react-native";
import { LightTheme, DarkTheme } from "@/colors/theme";

export function useTheme(options?: "light" | "dark") {
  if (options === "dark") {
    return DarkTheme;
  }
  
  if (options === "light") {
    return LightTheme;
  }
  
  const scheme = useColorScheme();
  return scheme === "dark" ? DarkTheme : LightTheme;
}