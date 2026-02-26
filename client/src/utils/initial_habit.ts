import { Habit } from "../interfaces";

export const INITIAL_HABITS: Habit[] = [{ _id: "1",  title: "Morning Meditation", icon: "🧘", category: "Mindfulness", streak: 14, completedToday: false, targetDays: 30 }];

export const WEEKLY_DATA = [
  { day: "Mon", completed: 5, total: 6 },
  { day: "Tue", completed: 6, total: 6 },
  { day: "Wed", completed: 4, total: 6 },
  { day: "Thu", completed: 6, total: 6 },
  { day: "Fri", completed: 3, total: 6 },
  { day: "Sat", completed: 5, total: 6 },
  { day: "Sun", completed: 2, total: 6 },
];


export const MONTHLY_HEATMAP = Array.from({ length: 35 }, (_, i) => ({
  day: i + 1,
  intensity: Math.random(),
  completed: Math.random() > 0.25,
}));
