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

// ─── Mock Data ────────────────────────────────────────────────────────────────
const WEEKLY_DATA = [
  { day: "Mon", completed: 5, total: 6 },
  { day: "Tue", completed: 6, total: 6 },
  { day: "Wed", completed: 4, total: 6 },
  { day: "Thu", completed: 6, total: 6 },
  { day: "Fri", completed: 3, total: 6 },
  { day: "Sat", completed: 5, total: 6 },
  { day: "Sun", completed: 2, total: 6 },
];

const MONTHLY_HEATMAP = Array.from({ length: 35 }, (_, i) => ({
  day: i + 1,
  intensity: Math.random(),
  completed: Math.random() > 0.25,
}));

const HABIT_STATS = [
  { name: "Meditation", icon: "🧘", completion: 0.92, streak: 14, trend: "+3%" },
  { name: "Running", icon: "🏃", completion: 0.78, streak: 7, trend: "-2%" },
  { name: "Reading", icon: "📖", completion: 0.88, streak: 21, trend: "+7%" },
  { name: "Hydration", icon: "💧", completion: 0.95, streak: 5, trend: "+1%" },
];

// ─── Components ───────────────────────────────────────────────────────────────
function BarChart() {
  const maxVal = Math.max(...WEEKLY_DATA.map((d) => d.completed));
  const chartHeight = 120;

  return (
    <View style={bStyles.chart}>
      {WEEKLY_DATA.map((d, i) => {
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

function HeatmapGrid() {
  return (
    <View style={hmStyles.grid}>
      {MONTHLY_HEATMAP.map((cell, i) => (
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

function StatBar({ value, label }: { value: number; label: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: value, duration: 900, useNativeDriver: false }).start();
  }, []);
  const barWidth = anim.interpolate({ inputRange: [0, 1], outputRange: ["0%", `${value * 100}%`] });

  return (
    <View style={sbStyles.row}>
      <Text style={sbStyles.label}>{label}</Text>
      <View style={sbStyles.track}>
        <Animated.View style={[sbStyles.fill, { width: barWidth }]} />
      </View>
      <Text style={sbStyles.pct}>{Math.round(value * 100)}%</Text>
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AnalyticsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<"week" | "month">("week");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgCircle} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: "#0A0A0A" }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Overview Cards */}
          <View style={styles.overviewRow}>
            {[
              { label: "This Week", value: "87%", sub: "Avg completion", icon: "📈" },
              { label: "Best Habit", value: "💧", sub: "Hydration 95%", icon: "" },
              { label: "Month Score", value: "A+", sub: "Excellent", icon: "🏆" },
            ].map((card, i) => (
              <View key={i} style={styles.overviewCard}>
                <Text style={styles.overviewValue}>{card.value}</Text>
                <Text style={styles.overviewLabel}>{card.label}</Text>
                <Text style={styles.overviewSub}>{card.sub}</Text>
              </View>
            ))}
          </View>

          {/* Tab Selector */}
          <View style={styles.tabRow}>
            {(["week", "month"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tab, tab === t && styles.tabActive]}
                onPress={() => setTab(t)}
              >
                <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                  {t === "week" ? "This Week" : "This Month"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chart or Heatmap */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {tab === "week" ? "Daily Completions" : "Activity Heatmap"}
            </Text>
            <Text style={styles.cardSub}>
              {tab === "week" ? "Habits completed each day" : "Each square = one day of activity"}
            </Text>
            {tab === "week" ? <BarChart /> : <HeatmapGrid />}

            {tab === "month" && (
              <View style={hmStyles.legend}>
                <Text style={hmStyles.legendText}>Less</Text>
                {[0.1, 0.3, 0.55, 0.8, 1].map((op, i) => (
                  <View key={i} style={[hmStyles.legendDot, { backgroundColor: `rgba(10,10,10,${op})` }]} />
                ))}
                <Text style={hmStyles.legendText}>More</Text>
              </View>
            )}
          </View>

          {/* Completion by Habit */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Habit Performance</Text>
            <Text style={styles.cardSub}>Individual completion rates this month</Text>
            <View style={{ gap: 16, marginTop: 16 }}>
              {HABIT_STATS.map((h, i) => (
                <View key={i}>
                  <View style={styles.habitStatRow}>
                    <Text style={{ fontSize: 18 }}>{h.icon}</Text>
                    <Text style={styles.habitStatName}>{h.name}</Text>
                    <Text style={[styles.habitStatTrend, h.trend.startsWith("+") ? styles.trendUp : styles.trendDown]}>
                      {h.trend}
                    </Text>
                  </View>
                  <StatBar value={h.completion} label="" />
                </View>
              ))}
            </View>
          </View>

          {/* Milestone Card */}
          <View style={[styles.card, styles.milestoneCard]}>
            <Text style={styles.milestoneTitle}>🎖 Next Milestone</Text>
            <Text style={styles.milestoneSub}>Maintain a 30-day streak to unlock the Iron Discipline badge</Text>
            <View style={styles.milestoneBarBg}>
              <View style={[styles.milestoneBarFill, { width: "70%" }]} />
            </View>
            <Text style={styles.milestoneCaption}>21 / 30 days — You're on track!</Text>
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

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

  overviewRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  overviewCard: {
    flex: 1, backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14, alignItems: "center",
    borderWidth: 1, borderColor: "#F0F0F0",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  overviewValue: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22, fontWeight: "700", color: "#0A0A0A",
  },
  overviewLabel: { fontSize: 10, color: "#888888", fontWeight: "600", marginTop: 4, textAlign: "center" },
  overviewSub: { fontSize: 9, color: "#BBBBBB", marginTop: 2, textAlign: "center" },

  tabRow: {
    flexDirection: "row", backgroundColor: "#EBEBEB", borderRadius: 12, padding: 3, marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: "600", color: "#888888" },
  tabTextActive: { color: "#0A0A0A" },

  card: {
    backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: "#F0F0F0",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#0A0A0A" },
  cardSub: { fontSize: 12, color: "#AAAAAA", marginTop: 2, marginBottom: 16 },

  habitStatRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  habitStatName: { flex: 1, fontSize: 14, fontWeight: "600", color: "#0A0A0A" },
  habitStatTrend: { fontSize: 12, fontWeight: "600" },
  trendUp: { color: "#22CC66" },
  trendDown: { color: "#FF4444" },

  milestoneCard: { backgroundColor: "#0A0A0A" },
  milestoneTitle: { fontSize: 16, fontWeight: "700", color: "#FFFFFF", marginBottom: 6 },
  milestoneSub: { fontSize: 13, color: "#888888", lineHeight: 20, marginBottom: 16 },
  milestoneBarBg: { height: 5, backgroundColor: "#333333", borderRadius: 3, marginBottom: 8 },
  milestoneBarFill: { height: 5, backgroundColor: "#FFFFFF", borderRadius: 3 },
  milestoneCaption: { fontSize: 12, color: "#888888" },
});

const bStyles = StyleSheet.create({
  chart: { flexDirection: "row", alignItems: "flex-end", gap: 8, height: 140 },
  barCol: { flex: 1, alignItems: "center", gap: 6 },
  barBg: { width: "100%", backgroundColor: "#F5F5F5", borderRadius: 6, justifyContent: "flex-end", overflow: "hidden" },
  barFill: { width: "100%", backgroundColor: "#0A0A0A", borderRadius: 6 },
  barDay: { fontSize: 10, color: "#888888", fontWeight: "600" },
});

const hmStyles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  cell: { width: (width - 96) / 7, height: (width - 96) / 7, borderRadius: 4 },
  legend: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14, justifyContent: "flex-end" },
  legendDot: { width: 10, height: 10, borderRadius: 2 },
  legendText: { fontSize: 11, color: "#AAAAAA" },
});

const sbStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { width: 0, fontSize: 12, color: "#888888" },
  track: { flex: 1, height: 5, backgroundColor: "#F0F0F0", borderRadius: 3, overflow: "hidden" },
  fill: { height: 5, backgroundColor: "#0A0A0A", borderRadius: 3 },
  pct: { fontSize: 12, fontWeight: "600", color: "#555555", width: 36, textAlign: "right" },
});