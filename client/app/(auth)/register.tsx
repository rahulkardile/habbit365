import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { saveUser } from "@/services/auth";
import { useTheme } from "@/hooks/useTheme";

export default function Register() {
  const theme = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) return;

    const user = { name, email, password };
    await saveUser(user);

    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Create Account</Text>

      <TextInput
        placeholder="Name"
        style={[styles.input, { borderColor: theme.textSecondary, color: theme.textPrimary }]}
        onChangeText={setName}
      />

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
        onPress={handleRegister}
      >
        <Text style={{ color: theme.background }}>Register</Text>
      </TouchableOpacity>
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