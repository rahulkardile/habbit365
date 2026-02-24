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
