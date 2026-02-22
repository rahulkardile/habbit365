import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

function HabitIllustration() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    Animated.timing(ringAnim, {
      toValue: 1,
      duration: 1400,
      delay: 400,
      useNativeDriver: false,
    }).start();
  }, []);

  const HABITS = [
    { label: "Meditate", icon: "🧘", x: 28, y: 60, delay: 0 },
    { label: "Exercise", icon: "🏃", x: width * 0.55, y: 30, delay: 120 },
    { label: "Read", icon: "📖", x: 44, y: 195, delay: 240 },
    { label: "Hydrate", icon: "💧", x: width * 0.52, y: 175, delay: 360 },
    { label: "Sleep", icon: "😴", x: width * 0.25, y: 265, delay: 480 },
  ];

  return (
    <Animated.View style={[styles.illustrationContainer, { transform: [{ scale: pulseAnim }] }]}>
      {/* Central ring */}
      <View style={styles.centralRing}>
        <View style={styles.centralRingInner}>
          <Text style={styles.centralEmoji}>🔥</Text>
          <Text style={styles.centralStreakNum}>21</Text>
          <Text style={styles.centralStreakLabel}>day streak</Text>
        </View>
      </View>

      {/* Floating habit cards */}
      {HABITS.map((h, i) => (
        <FloatingCard key={i} {...h} index={i} />
      ))}

      {/* Decorative dots */}
      <View style={[styles.dot, { top: 20, right: 20 }]} />
      <View style={[styles.dot, { top: 80, right: 60, width: 6, height: 6 }]} />
      <View style={[styles.dot, { bottom: 30, left: 20, width: 5, height: 5 }]} />
    </Animated.View>
  );
}

function FloatingCard({ label, icon, x, y, delay, index }: any) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 300 + delay,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: index % 2 === 0 ? -6 : 6,
          duration: 2200 + index * 300,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200 + index * 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.habitCard,
        { left: x, top: y, opacity: fadeAnim, transform: [{ translateY: floatAnim }] },
      ]}
    >
      <Text style={styles.habitCardIcon}>{icon}</Text>
      <Text style={styles.habitCardLabel}>{label}</Text>
      <View style={styles.habitCardCheck}>
        <Text style={{ fontSize: 8, color: "#FFF" }}>✓</Text>
      </View>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const theme = useTheme("light");
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true, tension: 200, friction: 10 }).start();

  const handlePressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }).start();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background decorations */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Illustration area */}
      <View style={styles.illustrationWrapper}>
        <HabitIllustration />
      </View>

      {/* Content */}
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✦  Build better habits</Text>
        </View>

        <Text style={styles.title}>Every great life{"\n"}starts with a habit.</Text>

        <Text style={styles.subtitle}>
          Track your daily habits, celebrate streaks, and watch yourself transform — one day at a time.
        </Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { value: "50K+", label: "Active users" },
            { value: "94%", label: "Streak kept" },
            { value: "4.9★", label: "App rating" },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(auth)/register")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.fine}>Free to start · No credit card required</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  bgCircle1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#F0F0F0",
    top: -80,
    right: -80,
  },
  bgCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#F5F5F5",
    bottom: 80,
    left: -60,
  },
  illustrationWrapper: {
    height: height * 0.38,
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationContainer: {
    width: width - 48,
    height: height * 0.36,
    position: "relative",
  },
  centralRing: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: "#0A0A0A",
    top: "50%",
    left: "50%",
    marginTop: -65,
    marginLeft: -65,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  centralRingInner: { alignItems: "center" },
  centralEmoji: { fontSize: 28 },
  centralStreakNum: {
    fontSize: 22,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontWeight: "700",
    color: "#0A0A0A",
  },
  centralStreakLabel: { fontSize: 10, color: "#888888", fontWeight: "500", letterSpacing: 0.5 },
  habitCard: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  habitCardIcon: { fontSize: 14 },
  habitCardLabel: { fontSize: 12, fontWeight: "600", color: "#0A0A0A" },
  habitCardCheck: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#0A0A0A",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDDDDD",
  },
  content: { paddingHorizontal: 28, paddingBottom: 24 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#0A0A0A",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 18,
  },
  badgeText: { fontSize: 12, color: "#FFFFFF", fontWeight: "600", letterSpacing: 0.5 },
  title: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 34,
    fontWeight: "700",
    color: "#0A0A0A",
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  subtitle: { fontSize: 15, color: "#888888", lineHeight: 23, marginBottom: 24 },
  statsRow: {
    flexDirection: "row",
    marginBottom: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A0A0A",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  statLabel: { fontSize: 11, color: "#AAAAAA", fontWeight: "500", marginTop: 2 },
  button: {
    backgroundColor: "#0A0A0A",
    borderRadius: 14,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 14,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  buttonArrow: { color: "#FFFFFF", fontSize: 18, fontWeight: "300" },
  fine: { textAlign: "center", fontSize: 12, color: "#BBBBBB", fontWeight: "500" },
});