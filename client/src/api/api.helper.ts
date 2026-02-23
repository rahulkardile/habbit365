import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
    const data = await AsyncStorage.getItem("USER");
    const user = data ? JSON.parse(data) : "";
    return  "Bearer " + user.token;
};