import axios from "axios";
import { getToken } from "./api.helper";
import { serverUrl } from "./auth.service";

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
    const res = await axios.post(`${serverUrl}/habit/create`, payload, { headers: { Authorization:`${await getToken()}`} });
    return res.data;
};

export const allHabit = async (date: string) => {
    const res = await axios.get(`${serverUrl}/habit/by-date?date=${date}`, { headers: { Authorization:`${await getToken()}`} });
    return res.data;
};

export const getAnalytics = async () => {
    const res = await axios.get(`${serverUrl}/habit/analytics`, { headers: { Authorization:`${await getToken()}`} });
    console.log("Analytics response: ", res.data);
    return res.data;
};

export const toggleHabit = async (id: string) => {
 const res = await axios.put(`${serverUrl}/habit/toggle/${id}`, {}, { headers: { Authorization: await getToken() }});
    return res.data;
};

export const getCalendarData = async (currentYear: number, currentMonth: number) => {  
    const res = await axios.get(
        `${serverUrl}/habit/calendar?year=${currentYear}&month=${currentMonth}`
        , { headers: { Authorization: await getToken() }}
    );
    return res.data;
}