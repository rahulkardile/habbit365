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
const LEADERBOARD = [
  { rank: 1, name: "Sarah K.", avatar: "👩", streak: 128, badge: "🏆", habits: 8, title: "Streak Master" },
  { rank: 2, name: "Marcus L.", avatar: "👨‍💻", streak: 97, badge: "🥈", habits: 6, title: "Iron Will" },
  { rank: 3, name: "Priya M.", avatar: "👩‍🎨", streak: 84, badge: "🥉", habits: 7, title: "Consistent" },
  { rank: 4, name: "Daniel R.", avatar: "🧑‍🚀", streak: 67, badge: "🔥", habits: 5, title: "Rising Star" },
  { rank: 5, name: "Emily T.", avatar: "👩‍🔬", streak: 55, badge: "⚡", habits: 6, title: "Focused" },
  { rank: 6, name: "James W.", avatar: "🧑‍🎤", streak: 42, badge: "✨", habits: 4, title: "Dedicated" },
  { rank: 7, name: "Aisha B.", avatar: "👩‍💼", streak: 38, badge: "💫", habits: 5, title: "Motivated" },
  { rank: 8, name: "You", avatar: "⭐", streak: 21, badge: "🔥", habits: 6, title: "Climbing Up!", isMe: true },
  { rank: 9, name: "Noah C.", avatar: "🧑‍🏫", streak: 18, badge: "🌱", habits: 3, title: "Getting Started" },
  { rank: 10, name: "Lily A.", avatar: "👩‍🎤", streak: 12, badge: "🌱", habits: 4, title: "New Habit" },
];

const FILTERS = ["All Time", "This Week", "This Month"];

function PodiumCard({ user, height: podHeight }: { user: typeof LEADERBOARD[0]; height: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      delay: (3 - user.rank) * 120,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[pStyles.wrapper, { transform: [{ scale: anim }] }]}>
      <Text style={pStyles.badge}>{user.badge}</Text>
      <Text style={pStyles.name}>{user.name.split(" ")[0]}</Text>
      <Text style={pStyles.streak}>🔥 {user.streak}d</Text>
      <View style={[pStyles.podium, { height: podHeight, backgroundColor: user.rank === 1 ? "#0A0A0A" : "#EBEBEB" }]}>
        <Text style={[pStyles.rank, { color: user.rank === 1 ? "#FFFFFF" : "#888888" }]}>#{user.rank}</Text>
      </View>
    </Animated.View>
  );
}

function LeaderRow({ user, index }: { user: typeof LEADERBOARD[0]; index: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 50 + index * 60, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, delay: 50 + index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        rStyles.row,
        (user as any).isMe && rStyles.rowMe,
        { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
      ]}
    >
      <Text style={rStyles.rank}>#{user.rank}</Text>
      <View style={rStyles.avatar}>
        <Text style={{ fontSize: 20 }}>{user.avatar}</Text>
      </View>
      <View style={rStyles.info}>
        <Text style={[rStyles.name, (user as any).isMe && rStyles.nameMe]}>{user.name}</Text>
        <Text style={rStyles.title}>{user.title}</Text>
      </View>
      <View style={rStyles.right}>
        <Text style={rStyles.badge}>{user.badge}</Text>
        <View style={rStyles.streakPill}>
          <Text style={rStyles.streakText}>🔥 {user.streak}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const top3 = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgCircle} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: "#0A0A0A" }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={{ fontSize: 16 }}>↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* Tagline */}
          <View style={styles.tagRow}>
            <Text style={styles.tagline}>See how you stack up against the community 🌍</Text>
          </View>

          {/* My rank card */}
          <View style={styles.myRankCard}>
            <View>
              <Text style={styles.myRankLabel}>Your Rank</Text>
              <Text style={styles.myRankNum}>#8</Text>
            </View>
            <View style={styles.myRankDivider} />
            <View>
              <Text style={styles.myRankLabel}>Your Streak</Text>
              <Text style={styles.myRankNum}>🔥 21</Text>
            </View>
            <View style={styles.myRankDivider} />
            <View>
              <Text style={styles.myRankLabel}>To Next Rank</Text>
              <Text style={styles.myRankNum}>17d</Text>
            </View>
          </View>

          {/* Podium */}
          <View style={styles.podiumSection}>
            <Text style={styles.sectionTitle}>Top Performers</Text>
            <View style={styles.podium}>
              <PodiumCard user={top3[1]} height={60} />
              <PodiumCard user={top3[0]} height={90} />
              <PodiumCard user={top3[2]} height={45} />
            </View>
          </View>

          {/* Filter */}
          <View style={styles.filterRow}>
            {FILTERS.map((f, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.filterBtn, activeFilter === i && styles.filterBtnActive]}
                onPress={() => setActiveFilter(i)}
              >
                <Text style={[styles.filterText, activeFilter === i && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Leaderboard rows */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Full Rankings</Text>
            <Text style={styles.sectionSub}>{LEADERBOARD.length} participants</Text>
          </View>

          <View style={styles.listCard}>
            {LEADERBOARD.map((u, i) => (
              <LeaderRow key={u.rank} user={u} index={i} />
            ))}
          </View>

          {/* Community insight */}
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>💡 Community Insight</Text>
            <Text style={styles.insightBody}>
              Top performers maintain an average of 6.2 habits daily. The most popular habit this week is{" "}
              <Text style={{ fontWeight: "700" }}>Morning Meditation 🧘</Text>
            </Text>
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
  shareBtn: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: "#0A0A0A",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 20, fontWeight: "700", color: "#0A0A0A",
  },
  scroll: { paddingHorizontal: 24, paddingBottom: 48 },

  tagRow: { marginBottom: 16 },
  tagline: { fontSize: 14, color: "#888888", lineHeight: 21 },

  myRankCard: {
    backgroundColor: "#0A0A0A", borderRadius: 20, padding: 20,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  myRankLabel: { fontSize: 11, color: "#888888", fontWeight: "500", marginBottom: 4 },
  myRankNum: {
    fontSize: 20, fontWeight: "700", color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  myRankDivider: { width: 1, height: 40, backgroundColor: "#333333" },

  podiumSection: { marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 18, fontWeight: "700", color: "#0A0A0A", marginBottom: 14,
  },
  sectionSub: { fontSize: 13, color: "#AAAAAA" },
  podium: { flexDirection: "row", alignItems: "flex-end", gap: 10, justifyContent: "center" },

  filterRow: {
    flexDirection: "row", gap: 8, marginBottom: 20,
  },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#EBEBEB",
  },
  filterBtnActive: { backgroundColor: "#0A0A0A", borderColor: "#0A0A0A" },
  filterText: { fontSize: 13, fontWeight: "600", color: "#888888" },
  filterTextActive: { color: "#FFFFFF" },

  listCard: {
    backgroundColor: "#FFFFFF", borderRadius: 20, overflow: "hidden",
    borderWidth: 1, borderColor: "#F0F0F0", marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },

  insightCard: {
    backgroundColor: "#F7F7F7", borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: "#EBEBEB",
  },
  insightTitle: { fontSize: 14, fontWeight: "700", color: "#0A0A0A", marginBottom: 8 },
  insightBody: { fontSize: 13, color: "#555555", lineHeight: 20 },
});

const pStyles = StyleSheet.create({
  wrapper: { flex: 1, alignItems: "center" },
  badge: { fontSize: 24, marginBottom: 4 },
  name: { fontSize: 11, fontWeight: "700", color: "#0A0A0A", textAlign: "center" },
  streak: { fontSize: 11, color: "#888888", marginBottom: 6 },
  podium: { width: "100%", borderRadius: 10, justifyContent: "flex-end", alignItems: "center", paddingBottom: 8 },
  rank: { fontSize: 13, fontWeight: "700" },
});

const rStyles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", padding: 14, gap: 12,
    borderBottomWidth: 1, borderBottomColor: "#F5F5F5",
  },
  rowMe: { backgroundColor: "#F0F8FF" },
  rank: { width: 28, fontSize: 13, fontWeight: "700", color: "#AAAAAA", textAlign: "center" },
  avatar: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: "#F5F5F5",
    justifyContent: "center", alignItems: "center",
  },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "600", color: "#0A0A0A" },
  nameMe: { color: "#0055CC" },
  title: { fontSize: 11, color: "#AAAAAA", marginTop: 2 },
  right: { alignItems: "flex-end", gap: 4 },
  badge: { fontSize: 16 },
  streakPill: {
    backgroundColor: "#F5F5F5", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
  },
  streakText: { fontSize: 11, fontWeight: "600", color: "#555555" },
});