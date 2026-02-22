import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { getUser } from "@/src/services/auth";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginUser } from "@/src/api/auth.service";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

function AnimatedInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
}) {
  const [focused, setFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

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
    outputRange: [15, 11],
  });

  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#AAAAAA", "#555555"],
  });

  return (
    <Animated.View style={[styles.inputWrapper, { borderColor }]}>
      <Animated.Text
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
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </Animated.View>
  );
}

export default function Login() {
  const theme = useTheme("light");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  console.log(AsyncStorage.getItem("USER"));
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
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

  const handleLogin = async () => {
    setLoading(true);
    try {
      const storedUser = await loginUser(email, password);
      if (storedUser.status === "success") {
        router.replace("/(tabs)/home");
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: storedUser.message || "Invalid credentials",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background decoration */}
      <View style={styles.bgDot1} />
      <View style={styles.bgDot2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Logo mark */}
          <View style={styles.logoMark}>
            <View style={styles.logoInner} />
          </View>

          {/* Header */}
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.title}>Sign in to{"\n"}your account</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to continue where you left off.
          </Text>

          {/* Inputs */}
          <View style={styles.form}>
            <AnimatedInput
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <AnimatedInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.forgotWrapper}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* CTA */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonLoading]}
              onPress={handleLogin}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Signing in..." : "Continue"}
              </Text>
              {!loading && <Text style={styles.buttonArrow}>→</Text>}
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.registerLink}>Create one</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  bgDot1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#F0F0F0",
    top: -80,
    right: -80,
  },
  bgDot2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#F5F5F5",
    bottom: 60,
    left: -60,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#0A0A0A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoInner: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    opacity: 0.9,
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
    marginBottom: 36,
    fontWeight: "400",
  },
  form: {
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
    height: 28,
    fontSize: 15,
    color: "#0A0A0A",
    fontWeight: "400",
    paddingBottom: 4,
  },
  forgotWrapper: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    color: "#555555",
    fontWeight: "500",
  },
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#EBEBEB",
  },
  dividerText: {
    fontSize: 13,
    color: "#AAAAAA",
    fontWeight: "500",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerPrompt: {
    fontSize: 14,
    color: "#888888",
  },
  registerLink: {
    fontSize: 14,
    color: "#0A0A0A",
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "#CCCCCC",
  },
});