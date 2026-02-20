import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getUser } from "@/services/auth";
import { useTheme } from "@/hooks/useTheme";

export default function Login() {
  const theme = useTheme("light");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const storedUser = await getUser();

    if (!storedUser) {
      Alert.alert("No account found. Please register.");
      return;
    }

    if (
      storedUser.email === email &&
      storedUser.password === password
    ) {
      router.replace("/(tabs)/home");
    } else {
      Alert.alert("Invalid credentials");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Welcome Back</Text>

      <TextInput
        placeholder="Email"
        style={[styles.input, { borderColor: theme.textSecondary, color: theme.textPrimary }]}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={[styles.input, { borderColor: theme.textSecondary, color: theme.textPrimary }]}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.textPrimary }]}
        onPress={handleLogin}
      >
        <Text style={{ color: theme.background }}>Login </Text>
      </TouchableOpacity>
      <View style={{ alignItems: "center"}}>
        <Text style={{ color: theme.textSecondary, marginTop: 16 }}>
          Don't have an account?{" "}
          <Text
            style={{ color: theme.textPrimary, textDecorationLine: "underline" }}
            onPress={() => router.push("/(auth)/register")}
          >
            Register 
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 30 },
  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
});