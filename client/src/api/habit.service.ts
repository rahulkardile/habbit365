import axios from "axios";
import { getToken } from "./api.helper";

export const createHabit = async (data: any) => {
    let payload = {
        title: data.title,
        description: data.description,
        icon: data.selectedIcon,
        category: data.selectedCategory,
        frequency: data.selectedFrequency,
        endDate: data.targetDays,
        reminderTime: data.reminderTime,
        reminderEnabled: data.reminderEnabled
    }
    const res = await axios.post("http://localhost:5000/api/habit/create", payload, { headers: { Authorization:`${await getToken()}`} });
    return res.data;
};

export const allHabit = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const res = await axios.get(`http://localhost:5000/api/habit/by-date?date=${formattedDate}`, { headers: { Authorization:`${await getToken()}`} });
    return res.data;
};

export const toggleHabit = async (id: string) => {
 const res = await axios.put(`http://localhost:5000/api/habit/toggle/${id}`, {}, { headers: { Authorization: await getToken() }});
    return res.data;
};
