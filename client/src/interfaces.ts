export interface User {
    name: string;
    email: string;
    password: string;
}

export interface Habit {
  _id: string;
  name: string;
  icon: string;
  category: string;
  streak: number;
  completedToday: boolean;
  targetDays: number;
}
