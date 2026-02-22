import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const DAYS_HEADER = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ─── Generate mock month data ────────────────────────────────────────────────
function generateMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const cells: Array<{ day: number | null; status: "completed" | "partial" | "missed" | "future" | "none" }> = [];

  for (let i = 0; i < firstDay; i++) cells.push({ day: null, status: "none" });

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    const isPast = cellDate < today;
    const isToday = isCurrentMonth && d === today.getDate();

    let status: "completed" | "partial" | "missed" | "future" | "none";
    if (isToday) status = "partial";
    else if (isPast) {
      const r = Math.random();
      status = r > 0.7 ? "completed" : r > 0.3 ? "partial" : "missed";
    } else {
      status = "future";
    }

    cells.push({ day: d, status });
  }

  return { cells, firstDay, daysInMonth };
}

const STATUS_CONFIG = {
  completed: { bg: "#0A0A0A", text: "#FFFFFF", label: "All done" },
  partial: { bg: "#E8E8E8", text: "#0A0A0A", label: "Partial" },
  missed: { bg: "#FFE8E8", text: "#CC2222", label: "Missed" },
  future: { bg: "#FAFAFA", text: "#CCCCCC", label: "Upcoming" },
  none: { bg: "transparent", text: "transparent", label: "" },
};

const HABIT_LOG = [
  { icon: "🧘", name: "Meditation", done: true },
  { icon: "🏃", name: "Running", done: true },
  { icon: "📖", name: "Reading", done: false },
  { icon: "💧", name: "Hydration", done: true },
  { icon: "📝", name: "Journaling", done: false },
];

export default function CalendarScreen() {
  const router = useRouter();
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const { cells } = generateMonthData(currentYear, currentMonth);

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const goMonth = (dir: 1 | -1) => {
    let m = currentMonth + dir;
    let y = currentYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  const completedCount = cells.filter((c) => c.day !== null && c.status === "completed").length;
  const totalPast = cells.filter((c) => c.day !== null && c.status !== "future" && c.status !== "none").length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgCircle} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: "#0A0A0A" }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* Month header */}
          <View style={styles.monthHeader}>
            <TouchableOpacity style={styles.monthBtn} onPress={() => goMonth(-1)}>
              <Text style={styles.monthBtnText}>‹</Text>
            </TouchableOpacity>
            <View style={styles.monthInfo}>
              <Text style={styles.monthName}>{monthName}</Text>
              <Text style={styles.monthStats}>{completedCount}/{totalPast} days completed</Text>
            </View>
            <TouchableOpacity style={styles.monthBtn} onPress={() => goMonth(1)}>
              <Text style={styles.monthBtnText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Month completion bar */}
          <View style={styles.monthBarCard}>
            <View style={styles.monthBarBg}>
              <View style={[styles.monthBarFill, { width: `${totalPast > 0 ? (completedCount / totalPast) * 100 : 0}%` }]} />
            </View>
            <Text style={styles.monthBarPct}>
              {totalPast > 0 ? Math.round((completedCount / totalPast) * 100) : 0}% success rate this month
            </Text>
          </View>

          {/* Calendar */}
          <View style={styles.calendarCard}>
            {/* Day headers */}
            <View style={styles.dayHeaders}>
              {DAYS_HEADER.map((d) => (
                <Text key={d} style={styles.dayHeader}>{d}</Text>
              ))}
            </View>

            {/* Cells */}
            <View style={styles.grid}>
              {cells.map((cell, i) => {
                if (!cell.day) return <View key={i} style={styles.emptyCell} />;
                const cfg = STATUS_CONFIG[cell.status];
                const isSelected = cell.day === selectedDay;
                const isToday = cell.day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();

                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.cell,
                      { backgroundColor: cfg.bg },
                      isSelected && styles.cellSelected,
                      isToday && styles.cellToday,
                    ]}
                    onPress={() => cell.status !== "future" && setSelectedDay(cell.day!)}
                    activeOpacity={0.7}
                    disabled={cell.status === "future"}
                  >
                    <Text style={[styles.cellText, { color: cfg.text }, isSelected && styles.cellTextSelected]}>
                      {cell.day}
                    </Text>
                    {isToday && <View style={styles.todayRing} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              {[
                { color: "#0A0A0A", label: "All done" },
                { color: "#E8E8E8", label: "Partial", border: true },
                { color: "#FFE8E8", label: "Missed" },
              ].map((l, i) => (
                <View key={i} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: l.color, borderWidth: l.border ? 1 : 0, borderColor: "#DDDDDD" }]} />
                  <Text style={styles.legendText}>{l.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Selected day detail */}
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>
              {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric",
              })}
            </Text>
            <Text style={styles.detailSub}>3 of 5 habits completed</Text>

            <View style={styles.detailList}>
              {HABIT_LOG.map((h, i) => (
                <View key={i} style={styles.detailItem}>
                  <View style={[styles.detailIcon]}>
                    <Text style={{ fontSize: 16 }}>{h.icon}</Text>
                  </View>
                  <Text style={styles.detailName}>{h.name}</Text>
                  <View style={[styles.detailCheck, h.done && styles.detailCheckDone]}>
                    <Text style={{ fontSize: 10, color: h.done ? "#FFF" : "#CCCCCC" }}>✓</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CELL_SIZE = Math.floor((width - 48 - 40) / 7);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  bgCircle: {
    position: "absolute", width: 240, height: 240, borderRadius: 120,
    backgroundColor: "#F0F0F0", top: -60, right: -50,
  },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: "#FFFFFF",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "#EBEBEB",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 20, fontWeight: "700", color: "#0A0A0A",
  },
  scroll: { paddingHorizontal: 24, paddingBottom: 48 },

  monthHeader: {
    flexDirection: "row", alignItems: "center", marginBottom: 14,
  },
  monthBtn: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: "#FFFFFF",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "#EBEBEB",
  },
  monthBtnText: { fontSize: 22, color: "#0A0A0A", fontWeight: "300" },
  monthInfo: { flex: 1, alignItems: "center" },
  monthName: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 18, fontWeight: "700", color: "#0A0A0A",
  },
  monthStats: { fontSize: 12, color: "#888888", marginTop: 2 },

  monthBarCard: {
    backgroundColor: "#FFFFFF", borderRadius: 12, padding: 14, marginBottom: 14,
    borderWidth: 1, borderColor: "#F0F0F0",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  monthBarBg: { height: 5, backgroundColor: "#F0F0F0", borderRadius: 3, marginBottom: 8 },
  monthBarFill: { height: 5, backgroundColor: "#0A0A0A", borderRadius: 3 },
  monthBarPct: { fontSize: 12, color: "#888888" },

  calendarCard: {
    backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: "#F0F0F0",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  dayHeaders: { flexDirection: "row", marginBottom: 8 },
  dayHeader: { flex: 1, textAlign: "center", fontSize: 11, fontWeight: "600", color: "#AAAAAA" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  emptyCell: { width: CELL_SIZE, height: CELL_SIZE },
  cell: {
    width: CELL_SIZE, height: CELL_SIZE, borderRadius: 8,
    justifyContent: "center", alignItems: "center", position: "relative",
  },
  cellSelected: { borderWidth: 2, borderColor: "#0A0A0A" },
  cellToday: {},
  cellText: { fontSize: 13, fontWeight: "600" },
  cellTextSelected: {},
  todayRing: {
    position: "absolute", bottom: 3,
    width: 4, height: 4, borderRadius: 2, backgroundColor: "#0A0A0A",
  },
  legend: { flexDirection: "row", gap: 16, marginTop: 16, justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 11, color: "#888888" },

  detailCard: {
    backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: "#F0F0F0",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  detailTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 16, fontWeight: "700", color: "#0A0A0A",
  },
  detailSub: { fontSize: 13, color: "#888888", marginTop: 3, marginBottom: 16 },
  detailList: { gap: 12 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  detailIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: "#F7F7F7",
    justifyContent: "center", alignItems: "center",
  },
  detailName: { flex: 1, fontSize: 14, fontWeight: "500", color: "#0A0A0A" },
  detailCheck: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: "#F0F0F0",
    justifyContent: "center", alignItems: "center",
  },
  detailCheckDone: { backgroundColor: "#0A0A0A" },
});