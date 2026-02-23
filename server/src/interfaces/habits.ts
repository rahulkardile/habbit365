import { Types } from "mongoose";

export interface IHabit extends Document {
  user: Types.ObjectId;
  name: string;
  icon: string;
  category: string;
  streak: number;
  completedToday: boolean;
  targetDays: number;
}
