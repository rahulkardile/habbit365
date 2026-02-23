import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { createHabit } from "@/src/api/habit.service";
import Toast from "react-native-toast-message";

const CATEGORIES = [
  { label: "Mindfulness", icon: "🧘" },
  { label: "Fitness", icon: "🏃" },
  { label: "Learning", icon: "📖" },
  { label: "Health", icon: "💧" },
  { label: "Wellness", icon: "🚿" },
  { label: "Finance", icon: "💰" },
  { label: "Social", icon: "🤝" },
  { label: "Creative", icon: "🎨" },
];

const ICONS = ["🧘", "🏃", "📖", "💧", "🚿", "💪", "🥗", "😴", "📝", "🎯", "🎨", "🧠", "🌿", "💰", "🤝", "🎵"];

const FREQUENCIES = [
  { label: "Daily", sub: "Every day" },
  { label: "Weekdays", sub: "Mon – Fri" },
  { label: "Weekly", sub: "Once a week" },
  { label: "Custom", sub: "You choose" },
];

const TARGET_OPTIONS = [7, 14, 21, 30, 60, 90];

const REMINDER_TIMES = ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "12:00 PM", "06:00 PM", "08:00 PM", "09:00 PM"];

function FloatingInput({ placeholder, value, onChangeText, multiline = false, maxLength }: { placeholder: string; value: string; onChangeText: (t: string) => void; multiline?: boolean; maxLength?: number; }) {
  const [focused, setFocused] = useState(false);
  const borderColor = useRef(new Animated.Value(0)).current;
  const labelTop = useRef(new Animated.Value(value ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(borderColor, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(labelTop, {
      toValue: focused || value ? 0 : 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focused, value]);

  const animatedBorder = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E5E5E5", "#0A0A0A"],
  });
  const animLabelTop = labelTop.interpolate({ inputRange: [0, 1], outputRange: [7, 18] });
  const animLabelSize = labelTop.interpolate({ inputRange: [0, 1], outputRange: [11, 15] });
  const animLabelColor = labelTop.interpolate({
    inputRange: [0, 1],
    outputRange: ["#555555", "#AAAAAA"],
  });

  return (
    <Animated.View
      style={[
        styles.floatWrapper,
        { borderColor: animatedBorder, height: multiline ? 96 : 58 },
      ]}
    >
      <Animated.Text
        style={[styles.floatLabel, { top: animLabelTop, fontSize: animLabelSize, color: animLabelColor }]}
      >
        {placeholder}
      </Animated.Text>
      <TextInput
        style={[styles.floatInput, multiline && { height: 54, textAlignVertical: "top", paddingTop: 2 }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline={multiline}
        maxLength={maxLength}
        autoCapitalize="sentences"
      />
      {maxLength && value.length > 0 && (
        <Text style={styles.charCount}>{value.length}/{maxLength}</Text>
      )}
    </Animated.View>
  );
}

function SectionLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={styles.sectionLabelText}>{label}</Text>
      {hint && <Text style={styles.sectionHint}>{hint}</Text>}
    </View>
  );
}

export default function AddHabitScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🎯");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("Daily");
  const [targetDays, setTargetDays] = useState(21);
  const [reminderTime, setReminderTime] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const toggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const toggleReminder = () => {
    const next = !reminderEnabled;
    setReminderEnabled(next);
    Animated.spring(toggleAnim, {
      toValue: next ? 1 : 0,
      tension: 180,
      friction: 12,
      useNativeDriver: false,
    }).start();
  };

  const toggleBg = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E5E5E5", "#0A0A0A"],
  });
  const toggleKnob = toggleAnim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });

  const isValid = name.trim().length > 0 && selectedCategory.length > 0;

  const handleSave = async () => {
    if (!isValid) return;
    const data = await createHabit({ name, description, selectedIcon, selectedCategory, selectedFrequency, targetDays, reminderTime, reminderEnabled });
    if (data.status === "success") {
      router.back();
    } else {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2:
          data?.message ||
          "Something went wrong",
      });
    }
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgCircle} />
      <View style={styles.bgCircle2} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

        {/* ── Top Bar ── */}
        <Animated.View style={[styles.topBar, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.screenEyebrow}>NEW HABIT</Text>
            <Text style={styles.screenTitle}>Build a routine</Text>
          </View>
          <View style={styles.iconPreview}>
            <Text style={styles.iconPreviewText}>{selectedIcon}</Text>
          </View>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* ── Name & Description ── */}
            <View style={styles.section}>
              <FloatingInput
                placeholder="Habit name"
                value={name}
                onChangeText={setName}
                maxLength={40}
              />
              <FloatingInput
                placeholder="Description (optional)"
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={120}
              />
            </View>

            {/* ── Choose Icon ── */}
            <View style={styles.section}>
              <SectionLabel label="Choose an icon" hint="Tap to select" />
              <View style={styles.iconGrid}>
                {ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconCell,
                      selectedIcon === icon && styles.iconCellActive,
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.iconCellEmoji}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <SectionLabel label="Category" />
              <View style={styles.chipGrid}>
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat.label;
                  return (
                    <TouchableOpacity
                      key={cat.label}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => setSelectedCategory(cat.label)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.chipEmoji}>{cat.icon}</Text>
                      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ── Frequency ── */}
            <View style={styles.section}>
              <SectionLabel label="Frequency" />
              <View style={styles.freqGrid}>
                {FREQUENCIES.map((f) => {
                  const active = selectedFrequency === f.label;
                  return (
                    <TouchableOpacity
                      key={f.label}
                      style={[styles.freqCard, active && styles.freqCardActive]}
                      onPress={() => setSelectedFrequency(f.label)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.freqLabel, active && styles.freqLabelActive]}>
                        {f.label}
                      </Text>
                      <Text style={[styles.freqSub, active && styles.freqSubActive]}>
                        {f.sub}
                      </Text>
                      {active && <View style={styles.freqDot} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ── Target Days ── */}
            <View style={styles.section}>
              <SectionLabel label="Goal duration" hint="days" />
              <View style={styles.targetRow}>
                {TARGET_OPTIONS.map((days) => {
                  const active = targetDays === days;
                  return (
                    <TouchableOpacity
                      key={days}
                      style={[styles.targetPill, active && styles.targetPillActive]}
                      onPress={() => setTargetDays(days)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.targetNum, active && styles.targetNumActive]}>
                        {days}
                      </Text>
                      <Text style={[styles.targetSub, active && styles.targetSubActive]}>
                        {days >= 30 ? "mo" : "d"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Visual goal bar */}
              <View style={styles.goalBarWrap}>
                <View style={styles.goalBarBg}>
                  <Animated.View
                    style={[
                      styles.goalBarFill,
                      { width: `${Math.min((targetDays / 90) * 100, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.goalBarLabel}>
                  {targetDays < 21 ? "Short sprint 🔥" : targetDays < 30 ? "Classic streak 💪" : "Long game 🏆"}
                </Text>
              </View>
            </View>

            {/* ── Reminder ── */}
            <View style={[styles.section, styles.reminderSection]}>
              <View style={styles.reminderHeader}>
                <View>
                  <Text style={styles.reminderTitle}>Daily Reminder</Text>
                  <Text style={styles.reminderSub}>Get a nudge at your chosen time</Text>
                </View>
                <TouchableOpacity onPress={toggleReminder} activeOpacity={0.8}>
                  <Animated.View style={[styles.toggle, { backgroundColor: toggleBg }]}>
                    <Animated.View style={[styles.toggleKnob, { left: toggleKnob }]} />
                  </Animated.View>
                </TouchableOpacity>
              </View>

              {reminderEnabled && (
                <Animated.View style={styles.timeGrid}>
                  {REMINDER_TIMES.map((t) => {
                    const active = reminderTime === t;
                    return (
                      <TouchableOpacity
                        key={t}
                        style={[styles.timePill, active && styles.timePillActive]}
                        onPress={() => setReminderTime(t)}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.timeLabel, active && styles.timeLabelActive]}>{t}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </Animated.View>
              )}
            </View>

            {/* ── Preview Card ── */}
            {name.length > 0 && (
              <View style={styles.section}>
                <SectionLabel label="Preview" hint="How it'll look" />
                <View style={styles.previewCard}>
                  <View style={styles.previewLeft}>
                    <View style={styles.previewIconWrap}>
                      <Text style={{ fontSize: 20 }}>{selectedIcon}</Text>
                    </View>
                    <View>
                      <Text style={styles.previewName}>{name}</Text>
                      <View style={styles.previewMeta}>
                        <Text style={styles.previewCategory}>{selectedCategory || "No category"}</Text>
                        <View style={styles.metaDot} />
                        <Text style={styles.previewFreq}>{selectedFrequency}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.previewCheck}>
                    <Text style={{ color: "#CCCCCC", fontSize: 14, fontWeight: "700" }}>✓</Text>
                  </View>
                </View>
              </View>
            )}

          </Animated.View>
        </ScrollView>

        {/* ── CTA ── */}
        <Animated.View style={[styles.ctaWrap, { opacity: fadeAnim }]}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
              onPress={handleSave}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
              disabled={!isValid}
            >
              <Text style={styles.saveBtnText}>
                {isValid ? "Save Habit" : "Fill in name & category"}
              </Text>
              {isValid && <Text style={styles.saveBtnArrow}>→</Text>}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  bgCircle: {
    position: "absolute",
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: "#F0F0F0",
    top: -80, right: -60,
  },
  bgCircle2: {
    position: "absolute",
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: "#F5F5F5",
    bottom: 100, left: -50,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 14,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "#EBEBEB",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  backArrow: { fontSize: 20, color: "#0A0A0A", fontWeight: "300" },
  screenEyebrow: {
    fontSize: 10, fontWeight: "700", color: "#AAAAAA",
    letterSpacing: 1.4, marginBottom: 2,
  },
  screenTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22, fontWeight: "700", color: "#0A0A0A",
  },
  iconPreview: {
    marginLeft: "auto",
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "#EBEBEB",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  iconPreviewText: { fontSize: 24 },

  scroll: { paddingBottom: 120 },

  section: { paddingHorizontal: 24, marginBottom: 28 },

  // Section label
  sectionLabelRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12,
  },
  sectionLabelText: {
    fontSize: 14, fontWeight: "700", color: "#0A0A0A",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  sectionHint: { fontSize: 12, color: "#AAAAAA", fontWeight: "500" },

  // Floating input
  floatWrapper: {
    borderWidth: 1.5, borderRadius: 14, marginBottom: 14,
    paddingHorizontal: 16, backgroundColor: "#FFFFFF",
    justifyContent: "flex-end",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  floatLabel: { position: "absolute", left: 16, fontWeight: "500" },
  floatInput: { height: 28, fontSize: 15, color: "#0A0A0A", paddingBottom: 4 },
  charCount: {
    position: "absolute", right: 14, bottom: 10,
    fontSize: 11, color: "#CCCCCC", fontWeight: "500",
  },

  // Icon grid
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  iconCell: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: "#EBEBEB",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  iconCellActive: {
    backgroundColor: "#0A0A0A", borderColor: "#0A0A0A",
  },
  iconCellEmoji: { fontSize: 22 },

  // Category chips
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: "#EBEBEB",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  chipActive: { backgroundColor: "#0A0A0A", borderColor: "#0A0A0A" },
  chipEmoji: { fontSize: 16 },
  chipLabel: { fontSize: 13, fontWeight: "600", color: "#555555" },
  chipLabelActive: { color: "#FFFFFF" },

  // Frequency grid
  freqGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  freqCard: {
    flex: 1, minWidth: "45%",
    padding: 14, borderRadius: 14,
    backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: "#EBEBEB",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  freqCardActive: { backgroundColor: "#0A0A0A", borderColor: "#0A0A0A" },
  freqLabel: { fontSize: 14, fontWeight: "700", color: "#0A0A0A", marginBottom: 3 },
  freqLabelActive: { color: "#FFFFFF" },
  freqSub: { fontSize: 12, color: "#AAAAAA" },
  freqSubActive: { color: "#888888" },
  freqDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: "#FFFFFF", opacity: 0.5,
    position: "absolute", top: 12, right: 12,
  },

  // Target pills
  targetRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  targetPill: {
    flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12,
    backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: "#EBEBEB",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  targetPillActive: { backgroundColor: "#0A0A0A", borderColor: "#0A0A0A" },
  targetNum: { fontSize: 15, fontWeight: "700", color: "#0A0A0A" },
  targetNumActive: { color: "#FFFFFF" },
  targetSub: { fontSize: 10, color: "#AAAAAA", fontWeight: "500" },
  targetSubActive: { color: "#888888" },

  goalBarWrap: { gap: 8 },
  goalBarBg: { height: 5, backgroundColor: "#F0F0F0", borderRadius: 3 },
  goalBarFill: { height: 5, backgroundColor: "#0A0A0A", borderRadius: 3 },
  goalBarLabel: { fontSize: 12, color: "#888888", fontWeight: "500" },

  // Reminder
  reminderSection: {
    backgroundColor: "#FFFFFF", borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: "#F0F0F0",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  reminderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reminderTitle: { fontSize: 15, fontWeight: "700", color: "#0A0A0A", marginBottom: 3 },
  reminderSub: { fontSize: 12, color: "#AAAAAA" },
  toggle: {
    width: 46, height: 26, borderRadius: 13,
    justifyContent: "center",
  },
  toggleKnob: {
    position: "absolute",
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
  },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  timePill: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    backgroundColor: "#F7F7F7", borderWidth: 1.5, borderColor: "#EBEBEB",
  },
  timePillActive: { backgroundColor: "#0A0A0A", borderColor: "#0A0A0A" },
  timeLabel: { fontSize: 13, color: "#555555", fontWeight: "600" },
  timeLabelActive: { color: "#FFFFFF" },

  // Preview card
  previewCard: {
    backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, borderColor: "#F0F0F0",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  previewLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  previewIconWrap: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: "#F7F7F7",
    justifyContent: "center", alignItems: "center",
  },
  previewName: { fontSize: 14, fontWeight: "600", color: "#0A0A0A", marginBottom: 3 },
  previewMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  previewCategory: { fontSize: 12, color: "#AAAAAA" },
  previewFreq: { fontSize: 12, color: "#555555", fontWeight: "500" },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#DDDDDD" },
  previewCheck: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#F0F0F0",
    justifyContent: "center", alignItems: "center",
  },

  // CTA
  ctaWrap: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingBottom: Platform.OS === "ios" ? 36 : 24,
    paddingTop: 16,
    backgroundColor: "#FAFAFA",
    borderTopWidth: 1, borderTopColor: "#F0F0F0",
  },
  saveBtn: {
    backgroundColor: "#0A0A0A", borderRadius: 14, height: 56,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  saveBtnDisabled: { backgroundColor: "#CCCCCC", shadowOpacity: 0.05 },
  saveBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600", letterSpacing: 0.2 },
  saveBtnArrow: { color: "#FFFFFF", fontSize: 18, fontWeight: "300" },
});