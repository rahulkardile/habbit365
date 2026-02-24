import mongoose, { Schema, Document } from "mongoose";
import { IHabitLog } from "../interfaces/habits";

const HabitLogSchema: Schema = new Schema(
  {
    habitId: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    completedToday: {
      type: Boolean,
      default: false,
      required: true
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Critical Unique Index (No duplicate log per habit per day)
HabitLogSchema.index(
  { habitId: 1, date: 1 },
  { unique: true }
);

// Fast calendar query
HabitLogSchema.index({ userId: 1, date: 1 });

// Fast streak calculation
HabitLogSchema.index({ habitId: 1, status: 1, date: -1 });

export default mongoose.model<IHabitLog>("HabitLog", HabitLogSchema);