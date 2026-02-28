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

export type CalendarStatus =
  | "completed"
  | "partial"
  | "missed"
  | "future"
  | "none";

  export interface CalendarCell {
  day: number | null;
  status: CalendarStatus;
}

export interface CalendarSummary {
  completedDays: number;
  totalTrackedDays: number;
  successRate: number;
}

export interface CalendarResponse {
  status: "success";
  year: number;
  month: number; // 0-based
  firstDay: number;
  daysInMonth: number;
  summary: CalendarSummary;
  cells: CalendarCell[];
}

export interface DayHabit {
  _id?: string;
  icon: string;
  title: string;
  completedToday: boolean;
}

