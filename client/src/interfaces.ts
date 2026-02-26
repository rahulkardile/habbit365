export interface User {
    name: string;
    email: string;
    password: string;
}

export interface Habit {
  _id: string;
  title: string;
  icon: string;
  category: string;
  streak: number;
  completedToday: boolean;
  targetDays: number;
}

export type WeekDay = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export interface WeeklyDataItem {
  day: WeekDay;
  completed: number;
  total: number;
}

export interface MonthlyHeatmapItem {
  day: number;        // 1 - 31
  intensity: number;  // 0 to 1 (completion ratio)
  completed: boolean; // whether at least one habit was completed
}

export type TrendDirection = "up" | "down" | "neutral";

export interface HabitStatItem {
  name: string;
  icon: string;
  completion: number;
  streak: number;
  trend: string; // "+3%"
  trendDirection?: TrendDirection;
}

export interface AnalyticsResponse {
  status: "success" | "error";
  weeklyData: WeeklyDataItem[];
  monthlyHeatmap: MonthlyHeatmapItem[];
  habitStats: HabitStatItem[];
}