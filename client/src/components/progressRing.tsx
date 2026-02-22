import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export function ProgressRing({ progress, size = 88, stroke = 6 }: { progress: number; size?: number; stroke?: number }) {
  const animVal = useRef(new Animated.Value(0)).current;
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animVal, { toValue: progress, duration: 1200, useNativeDriver: false }).start();
  }, [progress]);

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          position: "absolute",
          width: size - stroke,
          height: size - stroke,
          borderRadius: (size - stroke) / 2,
          borderWidth: stroke,
          borderColor: "#F0F0F0",
        }}
      />
      <View
        style={{
          position: "absolute",
          width: size - stroke,
          height: size - stroke,
          borderRadius: (size - stroke) / 2,
          borderWidth: stroke,
          borderColor: "#0A0A0A",
          borderRightColor: progress < 0.25 ? "#F0F0F0" : "#0A0A0A",
          borderBottomColor: progress < 0.5 ? "#F0F0F0" : "#0A0A0A",
          borderLeftColor: progress < 0.75 ? "#F0F0F0" : "#0A0A0A",
          transform: [{ rotate: "-90deg" }],
        }}
      />
    </View>
  );
}