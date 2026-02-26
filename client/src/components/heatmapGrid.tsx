import { Dimensions, StyleSheet, View, Text } from "react-native";
import { MonthlyHeatmapItem } from "../interfaces";

const { width } = Dimensions.get("window");
interface HeatmapGridProps {
  monthly_data: MonthlyHeatmapItem[];
}

export function HeatmapGrid({monthly_data}: HeatmapGridProps) {
  console.log({monthly_data});
  
  if(monthly_data === undefined || monthly_data.length === 0  ) {
    return (
      <View style={[hmStyles.grid, {justifyContent: "center"}]}>
        <Text style={{color: "#888888", fontSize: 12}}>No data for this month</Text>
      </View>
    );
  }

  return (
    <View style={hmStyles.grid}>
      {monthly_data?.map((cell, i) => (
        <View
          key={i}
          style={[
            hmStyles.cell,
            {
              backgroundColor: cell.completed
                ? `rgba(10,10,10,${0.15 + cell.intensity * 0.85})`
                : "#F0F0F0",
            },
          ]}
        />
      ))}
    </View>
  );
}


export const hmStyles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  cell: { width: (width - 96) / 7, height: (width - 96) / 7, borderRadius: 4 },
  legend: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14, justifyContent: "flex-end" },
  legendDot: { width: 10, height: 10, borderRadius: 2 },
  legendText: { fontSize: 11, color: "#AAAAAA" },
});