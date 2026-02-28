import { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, Text, Animated } from "react-native";

export function FloatingInput({ placeholder, value, onChangeText, multiline = false, maxLength }: { placeholder: string; value: string; onChangeText: (t: string) => void; multiline?: boolean; maxLength?: number; }) {
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

const styles = StyleSheet.create({
  floatWrapper: {
    borderWidth: 1.5, borderRadius: 14, marginBottom: 14,
    paddingHorizontal: 16, backgroundColor: "#FFFFFF",
    justifyContent: "flex-end",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  floatLabel: { position: "absolute", left: 16, fontWeight: "500" },
  floatInput: { height: 48, fontSize: 15, color: "#0A0A0A", paddingBottom: 4 },
  charCount: {
    position: "absolute", right: 14, bottom: 10,
    fontSize: 11, color: "#CCCCCC", fontWeight: "500",
  },
})