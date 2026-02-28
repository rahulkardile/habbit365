import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, StatusBar, TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";
import { Habit } from "@/src/interfaces";
import { SafeAreaView } from "react-native-safe-area-context";
import { StreakCard } from "@/src/components/streakCard";
import { ProgressRing } from "@/src/components/progressRing";
import { HabitCard } from "@/src/components/habitCard";
import { allHabit } from "@/src/api/habit.service";
import { INITIAL_HABITS } from "@/src/utils/initial_habit";
import { DAYS, formatLocalDate, getDateFromDayIndex, today } from "@/src/utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // ← NEW

export default function HomeScreen() {
  const router = useRouter();
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(today);
  const [stats, setStats] = useState({ totalStreak: 0, longestStreak: 0 });
  console.log({ selectedDay });

  const fetchHabits = useCallback((dayIndex: number) => {
    const selectedDate = getDateFromDayIndex(dayIndex);
    const formatted = formatLocalDate(selectedDate);
    setHabits([]);
    allHabit(formatted)
      .then((res) => {
        if (res.status === "success") {
          setHabits(Array.isArray(res.data) ? res.data : []);
          setStats(res.streak || { totalStreak: 0, longestStreak: 0 });
        }
      })
      .catch((err) => {
        console.log("Error fetching habits:", err);
      });
  }, []);

  useEffect(() => {
    fetchHabits(selectedDay);
  }, [selectedDay]);

  useFocusEffect(
    useCallback(() => {
      fetchHabits(selectedDay);
    }, [selectedDay])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["USER", "token"]);
      router.replace("/login");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  const completed = habits.filter((h) => h.completedToday).length;
  const total = habits.length;
  const progress = total > 0 ? completed / total : 0;

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h._id === id ? { ...h, completedToday: !h.completedToday } : h))
    );
  };

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";
  const selectedDateObj = getDateFromDayIndex(selectedDay);

  const todayStr = selectedDateObj.toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" }
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.bgCircle} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{greeting} 👋</Text>
              <Text style={styles.headerDate}>{todayStr}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.avatarBtn} onPress={() => setLogoutVisible(!logoutVisible)} >
                <Text style={{ fontSize: 16 }}>💀</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.notifBtn}>
                <Text style={{ fontSize: 18 }}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.avatarBtn} 
                // onPress={() => router.push("/(tabs)/leaderboard")} 
                >
                <Text style={{ fontSize: 16 }}>👤</Text>
              </TouchableOpacity>
            </View>
          </View>

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

          <StreakCard streak={stats.totalStreak} longestStreak={stats.longestStreak} />

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

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Habits</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push("/(tabs)/add-habit")}
            >
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {/* ── Habit List ── */}
          <View style={styles.habitList}>
            {habits.map((h, i) => (
              <HabitCard key={h._id} _id={h._id} habit={h} onToggle={() => toggleHabit(h._id)} index={i} />
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
              // onPress={() => router.push("/(tabs)/leaderboard")}
            >
              <Text style={styles.navIcon}>🏆</Text>
              <Text style={styles.navLabel}>Community</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* ── FIX 1: Modal lives outside SafeAreaView so it covers the full screen ── */}
      <Modal
        transparent
        visible={logoutVisible}
        animationType="fade"
        statusBarTranslucent // ensures overlay covers status bar on Android
      >
        <TouchableWithoutFeedback onPress={() => setLogoutVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Logout</Text>
                <Text style={styles.modalText}>
                  Do you really want to logout?
                </Text>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setLogoutVisible(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={async () => {
                      setLogoutVisible(false);
                      await handleLogout();
                    }}
                  >
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
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
  habitList: { paddingHorizontal: 24, gap: 10, marginBottom: 24 },

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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  cancelText: {
    color: "#666",
    fontWeight: "500",
  },
  logoutBtn: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});