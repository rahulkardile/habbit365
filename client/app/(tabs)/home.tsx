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

// ─── Types ───────────────────────────────────────────────────────────────────
interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  streak: number;
  completedToday: boolean;
  targetDays: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_HABITS: Habit[] = [
  { id: "1", name: "Morning Meditation", icon: "🧘", category: "Mindfulness", streak: 14, completedToday: false, targetDays: 30 },
  { id: "2", name: "Run 5km", icon: "🏃", category: "Fitness", streak: 7, completedToday: true, targetDays: 21 },
  { id: "3", name: "Read 30 mins", icon: "📖", category: "Learning", streak: 21, completedToday: false, targetDays: 30 },
  { id: "4", name: "Drink 2L Water", icon: "💧", category: "Health", streak: 5, completedToday: true, targetDays: 14 },
  { id: "5", name: "Journal Entry", icon: "📝", category: "Mindfulness", streak: 3, completedToday: false, targetDays: 7 },
  { id: "6", name: "Cold Shower", icon: "🚿", category: "Wellness", streak: 9, completedToday: false, targetDays: 14 },
];

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const today = new Date().getDay();

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ progress, size = 88, stroke = 6 }: { progress: number; size?: number; stroke?: number }) {
  const animVal = useRef(new Animated.Value(0)).current;
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animVal, { toValue: progress, duration: 1200, useNativeDriver: false }).start();
  }, [progress]);

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      {/* Background ring */}
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
      {/* Progress arc using border trick */}
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

// ─── Habit Card ────────────────────────────────────────────────────────────────
function HabitCard({ habit, onToggle, index }: { habit: Habit; onToggle: () => void; index: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(habit.completedToday ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 400,
      delay: 100 + index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleToggle = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, tension: 300 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300 }),
    ]).start();
    Animated.timing(checkAnim, {
      toValue: habit.completedToday ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    onToggle();
  };

  const checkBg = checkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F0F0F0", "#0A0A0A"],
  });

  return (
    <Animated.View style={[styles.habitCard, { opacity: fade, transform: [{ scale }] }]}>
      <View style={styles.habitLeft}>
        <View style={styles.habitIconWrap}>
          <Text style={styles.habitIcon}>{habit.icon}</Text>
        </View>
        <View>
          <Text style={styles.habitName}>{habit.name}</Text>
          <View style={styles.habitMeta}>
            <Text style={styles.habitCategory}>{habit.category}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.habitStreak}>🔥 {habit.streak}d</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={handleToggle} activeOpacity={0.8}>
        <Animated.View style={[styles.checkButton, { backgroundColor: checkBg }]}>
          <Text style={[styles.checkMark, { color: habit.completedToday ? "#FFFFFF" : "#CCCCCC" }]}>✓</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Streak Flame Card ─────────────────────────────────────────────────────────
function StreakCard({ streak, longestStreak }: { streak: number; longestStreak: number }) {
  const flameAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim, { toValue: 1.1, duration: 700, useNativeDriver: true }),
        Animated.timing(flameAnim, { toValue: 0.95, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.streakCard}>
      <Animated.Text style={[styles.streakFlame, { transform: [{ scale: flameAnim }] }]}>🔥</Animated.Text>
      <View style={styles.streakInfo}>
        <Text style={styles.streakNum}>{streak}</Text>
        <Text style={styles.streakLabel}>Current Streak</Text>
      </View>
      <View style={styles.streakDivider} />
      <View style={styles.streakInfo}>
        <Text style={styles.streakNum}>{longestStreak}</Text>
        <Text style={styles.streakLabel}>Best Ever</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [selectedDay, setSelectedDay] = useState(today);

  const completed = habits.filter((h) => h.completedToday).length;
  const total = habits.length;
  const progress = total > 0 ? completed / total : 0;

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completedToday: !h.completedToday } : h))
    );
  };

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background accents */}
      <View style={styles.bgCircle} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.headerDate}>{todayStr}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarBtn}
              // onPress={() => router.push("/(tabs)/leaderboard")}
            >
              <Text style={{ fontSize: 16 }}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Progress Card ── */}
        <View style={styles.progressCard}>
          <View style={styles.progressLeft}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressSub}>
              {completed} of {total} habits done
            </Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.progressPercent}>{Math.round(progress * 100)}% complete</Text>
          </View>
          <View>
            <ProgressRing progress={progress} size={90} stroke={7} />
            <Text style={styles.ringLabel}>{completed}/{total}</Text>
          </View>
        </View>

        {/* ── Streak Card ── */}
        <StreakCard streak={21} longestStreak={45} />

        {/* ── Day selector ── */}
        <View style={styles.dayRow}>
          {DAYS.map((d, i) => {
            const isToday = i === today;
            const isSelected = i === selectedDay;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dayBtn, isSelected && styles.dayBtnActive]}
                onPress={() => setSelectedDay(i)}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>{d}</Text>
                {isToday && <View style={styles.todayDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Section Header ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Habits</Text>
          <TouchableOpacity
            style={styles.addBtn}
            // onPress={() => router.push("/(tabs)/add-habit")}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* ── Habit List ── */}
        <View style={styles.habitList}>
          {habits.map((h, i) => (
            <HabitCard key={h.id} habit={h} onToggle={() => toggleHabit(h.id)} index={i} />
          ))}
        </View>

        {/* ── Bottom Nav Hint ── */}
        <View style={styles.navCard}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/(tabs)/analytics")}
          >
            <Text style={styles.navIcon}>📊</Text>
            <Text style={styles.navLabel}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/(tabs)/calendar")}
          >
            <Text style={styles.navIcon}>📅</Text>
            <Text style={styles.navLabel}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/(tabs)/leaderboard")}
          >
            <Text style={styles.navIcon}>🏆</Text>
            <Text style={styles.navLabel}>Community</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  bgCircle: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#F0F0F0",
    top: -80,
    right: -60,
  },
  scroll: { paddingBottom: 48 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    fontWeight: "700",
    color: "#0A0A0A",
  },
  headerDate: { fontSize: 13, color: "#888888", marginTop: 3 },
  headerRight: { flexDirection: "row", gap: 10 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#EBEBEB",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  avatarBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: "#0A0A0A",
    justifyContent: "center", alignItems: "center",
  },

  // Progress Card
  progressCard: {
    marginHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 14,
  },
  progressLeft: { flex: 1, paddingRight: 16 },
  progressTitle: { fontSize: 16, fontWeight: "700", color: "#0A0A0A", marginBottom: 4 },
  progressSub: { fontSize: 13, color: "#888888", marginBottom: 12 },
  progressBarBg: { height: 5, backgroundColor: "#F0F0F0", borderRadius: 3, marginBottom: 8 },
  progressBarFill: { height: 5, backgroundColor: "#0A0A0A", borderRadius: 3 },
  progressPercent: { fontSize: 12, color: "#555555", fontWeight: "600" },
  ringLabel: { textAlign: "center", fontSize: 12, color: "#888888", marginTop: 4 },

  // Streak Card
  streakCard: {
    marginHorizontal: 24,
    backgroundColor: "#0A0A0A",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  streakFlame: { fontSize: 32, marginRight: 16 },
  streakInfo: { flex: 1, alignItems: "center" },
  streakNum: {
    fontSize: 28, fontWeight: "700", color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  streakLabel: { fontSize: 11, color: "#888888", marginTop: 2, fontWeight: "500" },
  streakDivider: { width: 1, height: 40, backgroundColor: "#333333", marginHorizontal: 4 },

  // Day Row
  dayRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 20,
  },
  dayBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  dayBtnActive: { backgroundColor: "#0A0A0A", borderColor: "#0A0A0A" },
  dayLabel: { fontSize: 13, fontWeight: "600", color: "#888888" },
  dayLabelActive: { color: "#FFFFFF" },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#CCCCCC", marginTop: 3 },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: "700", color: "#0A0A0A",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  addBtn: {
    backgroundColor: "#0A0A0A",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  addBtnText: { fontSize: 13, color: "#FFFFFF", fontWeight: "600" },

  // Habit List
  habitList: { paddingHorizontal: 24, gap: 10, marginBottom: 24 },
  habitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  habitLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  habitIconWrap: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: "#F7F7F7",
    justifyContent: "center", alignItems: "center",
  },
  habitIcon: { fontSize: 20 },
  habitName: { fontSize: 14, fontWeight: "600", color: "#0A0A0A", marginBottom: 3 },
  habitMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  habitCategory: { fontSize: 12, color: "#AAAAAA" },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#DDDDDD" },
  habitStreak: { fontSize: 12, color: "#555555", fontWeight: "500" },
  checkButton: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: "center", alignItems: "center",
  },
  checkMark: { fontSize: 14, fontWeight: "700" },

  // Bottom nav card
  navCard: {
    marginHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  navItem: { alignItems: "center", gap: 4 },
  navIcon: { fontSize: 22 },
  navLabel: { fontSize: 11, color: "#888888", fontWeight: "500" },
});