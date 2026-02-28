import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TextInput } from "react-native";

export function AnimatedInput({ placeholder, value = "0", onChangeText, secureTextEntry = false, keyboardType = "default", delay = 0, }: { placeholder: string; value: string; onChangeText: (t: string) => void; secureTextEntry?: boolean; keyboardType?: any; delay?: number; }) {

    if (value === undefined) {
        return;
    }

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

const styles = StyleSheet.create({
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
    height: 47,
    fontSize: 15,
    color: "#0A0A0A",
    fontWeight: "400",
    paddingBottom: 4,
  },
});