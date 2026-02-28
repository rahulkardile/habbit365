import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../interfaces";
import axios from "axios";

export const serverUrl = "https://6spsgajca1.execute-api.ap-south-1.amazonaws.com/api";
// export const serverUrl = "http://localhost:5000/api";

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${serverUrl}/auth/login`, {
    email,
    password,
  });
  console.log("Login response:", res.data);
  if(res.data.status === "success") {
    await AsyncStorage.setItem("USER", JSON.stringify(res.data.data));
  }
  return res.data;
};

export const registerUser = async (data: User) => {
  const response = await axios.post(`${serverUrl}/auth/register`, data);
  console.log("response : ", response.data);
  if(response.data.status === "success") {
    await AsyncStorage.setItem("USER", JSON.stringify(response.data.data));
  }
  return response.data;
};