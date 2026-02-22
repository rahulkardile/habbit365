import { registerUser } from "@/src/api/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "habit365_user";

export const saveUser = async (user: any) => {
  registerUser(user);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async () => {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};