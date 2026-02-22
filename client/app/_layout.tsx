import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function RootLayout() {
    const router = useRouter();
    useEffect(() => {
        checkUser();
    }, []);
    const checkUser = async () => {
        const user = await AsyncStorage.getItem("USER");
        if (user) {
            router.replace("/(tabs)/home");
        } else {
            router.replace("/welcomeScreen");
        }
    };
    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <Toast />
        </SafeAreaProvider>
    );
}