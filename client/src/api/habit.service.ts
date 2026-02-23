import axios from "axios";
import { getToken } from "./api.helper";

export const createHabit = async (data: any) => {
    const res = await axios.post("http://localhost:5000/api/habit/create", data, { headers: { Authorization:`${await getToken()}`} });
    return res.data;
};

export const allHabit = async () => {
    const res = await axios.get("http://localhost:5000/api/habit/get", { headers: { Authorization:`${await getToken()}`} });
    return res.data;
};

export const toggleHabit = async (id: string) => {
 const res = await axios.put(`http://localhost:5000/api/habit/toggle/${id}`, {}, { headers: { Authorization: await getToken() }});
    return res.data;
};
