import mongoose, { Schema, Document } from "mongoose";
import { IHabit } from "../interfaces/habits";

const HabitSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
    },    
    reminderTime: {
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    frequency: {
      type: String,
      enum: ["Daily", "weekly", "Weekdays", "monthly", "custom"],
      default: "Daily",
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },    
    reminderEnabled: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

HabitSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model<IHabit>("Habit", HabitSchema);