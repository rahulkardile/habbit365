import mongoose, { Schema, Document, Types } from "mongoose";

export interface IHabit extends Document {
  user: Types.ObjectId;
  name: string;
  description?: string;
  icon: string;
  category: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  targetDays: number;
  streak: number;
  completedToday: boolean;
  reminderTime?: string;
  reminderEnabled: boolean;
}

const habitSchema = new Schema<IHabit>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      default: "Daily",
    },

    targetDays: {
      type: Number,
      required: true,
      default: 21,
    },

    streak: {
      type: Number,
      default: 0,
    },

    completedToday: {
      type: Boolean,
      default: false,
    },

    reminderTime: {
      type: String,
      default: "",
    },

    reminderEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IHabit>("Habit", habitSchema);