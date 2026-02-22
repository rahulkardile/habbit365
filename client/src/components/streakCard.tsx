import { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";

export function StreakCard({ streak, longestStreak }: { streak: number; longestStreak: number }) {
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

const styles = StyleSheet.create({
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

});