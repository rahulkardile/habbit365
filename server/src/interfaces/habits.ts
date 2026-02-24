import mongoose, { Types } from "mongoose";

export interface IHabitLog extends Document {
  habitId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  completedToday: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  category: string;
  reminderTime: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  reminderEnabled: boolean;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}