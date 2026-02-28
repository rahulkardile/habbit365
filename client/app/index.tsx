import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("USER").then((user) => {
            setIsAuthenticated(!!user);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAFAFA" }}>
                <ActivityIndicator size="large" color="#0A0A0A" />
            </View>
        );
    }

    return (
        <Redirect href={isAuthenticated ? "/(tabs)/home" : "/(auth)/welcomeScreen"} />
    );
}
