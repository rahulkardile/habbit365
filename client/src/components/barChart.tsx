import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { WeeklyDataItem } from "../interfaces";

export function BarChart({weekly_data}: {weekly_data: WeeklyDataItem[]}) {
  // const maxVal = Math.max(...weekly_data.map((d) => d.completed));
  const chartHeight = 120;

  console.log({weekly_data});
  
  if(weekly_data === undefined || weekly_data.length === 0  ) {
    return (
      <View style={[bStyles.chart, {justifyContent: "center"}]}>
        <Text style={{color: "#888888", fontSize: 12}}>No data for this week</Text>
      </View>
    );
  }

  return (
    <View style={bStyles.chart}>
      {weekly_data.map((d, i) => {
        const barH = (d.completed / d.total) * chartHeight;
        const anim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
          Animated.timing(anim, {
            toValue: barH,
            duration: 800,
            delay: i * 80,
            useNativeDriver: false,
          }).start();
        }, []);

        return (
          <View key={i} style={bStyles.barCol}>
            <View style={[bStyles.barBg, { height: chartHeight }]}>
              <Animated.View style={[bStyles.barFill, { height: anim }]} />
            </View>
            <Text style={bStyles.barDay}>{d.day}</Text>
          </View>
        );
      })}
    </View>
  );
}

const bStyles = StyleSheet.create({
  chart: { flexDirection: "row", alignItems: "flex-end", gap: 8, height: 140 },
  barCol: { flex: 1, alignItems: "center", gap: 6 },
  barBg: { width: "100%", backgroundColor: "#F5F5F5", borderRadius: 6, justifyContent: "flex-end", overflow: "hidden" },
  barFill: { width: "100%", backgroundColor: "#0A0A0A", borderRadius: 6 },
  barDay: { fontSize: 10, color: "#888888", fontWeight: "600" },
});