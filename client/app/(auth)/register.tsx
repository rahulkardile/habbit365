import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerUser } from "@/src/api/auth.service";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

function AnimatedInput({ placeholder, value, onChangeText, secureTextEntry = false, keyboardType = "default", delay = 0, }: { placeholder: string; value: string; onChangeText: (t: string) => void; secureTextEntry?: boolean; keyboardType?: any; delay?: number; }) {
  const [focused, setFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(mountAnim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(labelAnim, {
      toValue: focused || value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focused, value]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E5E5E5", "#0A0A0A"],
  });

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 6],
  });

  const labelSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#AAAAAA", "#555555"],
  });

  return (
    <Animated.View style={{ opacity: mountAnim }}>
      <Animated.View style={[styles.inputWrapper, { borderColor }]}>
        <Animated.Text
          pointerEvents="none"
          style={[
            styles.floatingLabel,
            { top: labelTop, fontSize: labelSize, color: labelColor },
          ]}
        >
          {placeholder}
        </Animated.Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === "email-address" || secureTextEntry ? "none" : "words"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Animated.View>
    </Animated.View>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#E5E5E5", "#FF4444", "#FFAA00", "#44AAFF", "#22CC66"];

  if (!password) return null;

  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBars}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.strengthBar,
              { backgroundColor: i <= strength ? colors[strength] : "#E5E5E5" },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.strengthLabel, { color: colors[strength] }]}>
        {labels[strength]}
      </Text>
    </View>
  );
}

export default function Register() {
  const theme = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(24)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const handleRegister = async () => {
    if (!email || !password || !name) return;
    setLoading(true);
    try {
      const user = { name, email, password };
      const userRegister = await registerUser(user);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerFade,
                transform: [{ translateY: headerSlide }],
              },
            ]}
          >
            {/* Back button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            {/* Step indicator */}
            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, styles.stepDotActive]} />
              <View style={styles.stepLine} />
              <View style={styles.stepDot} />
              <View style={styles.stepLine} />
              <View style={styles.stepDot} />
            </View>

            <Text style={styles.eyebrow}>Get started</Text>
            <Text style={styles.title}>Create your{"\n"}account</Text>
            <Text style={styles.subtitle}>
              Join thousands of users. It takes less than a minute.
            </Text>
          </Animated.View>

          {/* Form */}
          <View style={styles.form}>
            <AnimatedInput
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              delay={150}
            />
            <AnimatedInput
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              delay={250}
            />
            <AnimatedInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              delay={350}
            />
            <PasswordStrength password={password} />

            <Text style={styles.terms}>
              By creating an account you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>

          {/* CTA */}
          <Animated.View style={{ transform: [{ scale: buttonScale }], marginHorizontal: 28 }}>
            <TouchableOpacity
              style={[
                styles.button,
                (!name || !email || !password) && styles.buttonDisabled,
                loading && styles.buttonLoading,
              ]}
              onPress={handleRegister}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
              disabled={loading || !name || !email || !password}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating account..." : "Create Account"}
              </Text>
              {!loading && <Text style={styles.buttonArrow}>→</Text>}
            </TouchableOpacity>
          </Animated.View>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  bgCircle1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#F2F2F2",
    top: -100,
    right: -60,
  },
  bgCircle2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#F7F7F7",
    bottom: 200,
    right: -40,
  },
  bgCircle3: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#F0F0F0",
    bottom: -60,
    left: -80,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: 16,
    marginBottom: 36,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  backArrow: {
    fontSize: 20,
    color: "#0A0A0A",
    fontWeight: "300",
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDDDDD",
  },
  stepDotActive: {
    backgroundColor: "#0A0A0A",
    width: 24,
    borderRadius: 4,
  },
  stepLine: {
    width: 20,
    height: 1.5,
    backgroundColor: "#DDDDDD",
    marginHorizontal: 4,
  },
  eyebrow: {
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif",
    fontSize: 13,
    fontWeight: "600",
    color: "#888888",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 36,
    fontWeight: "700",
    color: "#0A0A0A",
    lineHeight: 44,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#888888",
    lineHeight: 22,
    fontWeight: "400",
  },
  form: {
    paddingHorizontal: 28,
    marginBottom: 24,
  },
  inputWrapper: {
    height: 58,
    borderWidth: 1.5,
    borderRadius: 14,
    marginBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  floatingLabel: {
    position: "absolute",
    left: 16,
    fontWeight: "500",
  },
  input: {
    height: 48,
    fontSize: 15,
    color: "#0A0A0A",
    fontWeight: "400",
    paddingBottom: 4,
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: -4,
    gap: 10,
  },
  strengthBars: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  terms: {
    fontSize: 12.5,
    color: "#AAAAAA",
    lineHeight: 18,
    textAlign: "center",
  },
  termsLink: {
    color: "#555555",
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#CCCCCC",
  },
  button: {
    backgroundColor: "#0A0A0A",
    borderRadius: 14,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0.05,
  },
  buttonLoading: {
    backgroundColor: "#444444",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "300",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginPrompt: {
    fontSize: 14,
    color: "#888888",
  },
  loginLink: {
    fontSize: 14,
    color: "#0A0A0A",
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#CCCCCC",
  },
});