import { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Animated, View } from "react-native";
import { Habit } from "../interfaces";

export function HabitCard({ habit, onToggle, index }: { habit: Habit; onToggle: () => void; index: number }) {
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

const styles = StyleSheet.create({
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
})