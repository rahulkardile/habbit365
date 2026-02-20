import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Dimensions,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function SetUp() {
    const theme = useTheme("light");
    const [isGuestMode, setIsGuestMode] = React.useState(false);
    const navigate = useRouter();

    const handleGuestLogin = () => {
        if (!isGuestMode) {
            setIsGuestMode(true);
            return;
        }
        navigate.push("/(tabs)/home");
    }

    const handleLogin = (route: "login" | "register") => {
        navigate.push(`/${route}`);
    }
    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: theme.background }]}
        >
            <View style={styles.container}>

                {/* Logo */}
                <Image
                    source={require("@/assets/habit-illustration.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Headline Section */}
                <View style={styles.textBlock}>
                    <Text style={[styles.title, { color: theme.textPrimary }]}>
                        Habit365
                    </Text>

                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        365 days. No excuses. Track your habits, stay motivated, and build a better you.
                    </Text>
                </View>
                {
                    isGuestMode &&
                    <View style={styles.valueBlock}>
                        <Text style={[styles.valueText, { color: theme.textSecondary }]}>
                            Login to sync your habits, save streaks,
                            and unlock personalized insights.
                        </Text>
                    </View>
                }

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <View style={{ flex: 0, gap: 12, marginBottom: 20 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.primaryButton,
                                { backgroundColor: theme.textPrimary },
                            ]}
                        >
                            <Text style={[styles.primaryText, { color: theme.background }]}>
                                Login / Register
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.primaryButton,
                                { backgroundColor: theme.textPrimary },
                            ]}
                        >
                            <Text style={[styles.primaryText, { color: theme.background }]}>
                                Login / Register
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity activeOpacity={0.6} onPress={() => handleGuestLogin()}>
                        <Text
                            style={[
                                styles.secondaryText,
                                { color: theme.textSecondary },
                            ]}
                        >
                            {isGuestMode ? "Continue as Guest" : "As Guest"}
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 28,
        gap: 34,
    },
    logo: {
        width: width * 0.9,
        height: 350,
    },
    textBlock: {
        alignItems: "center",
        marginTop: -20,
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        textAlign: "center",
        opacity: 0.8,
    },
    buttonContainer: {
        width: "100%",
    },
    primaryButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 14,
    },
    primaryText: {
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryText: {
        fontSize: 14,
        textAlign: "center",
    },

    valueBlock: {
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    valueText: {
        fontSize: 13,
        textAlign: "center",
        lineHeight: 18,
        opacity: 0.8,
    },
});