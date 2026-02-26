import express, { Response } from "express";
import { protect } from "../middlewares/token";
import { createHabit, getAnalytics, getCalendarData, getHabitsByDate, getHabitStreak, toggleHabit } from "../controller/habit.controller";

const router = express.Router();

router.post("/create", protect, createHabit);

router.get("/by-date", protect, getHabitsByDate);

router.put("/toggle/:habitId", protect, toggleHabit);

router.get("/analytics", protect, getAnalytics);

router.get("/calendar", protect, getCalendarData);

router.get("/habit/:habitId/streak", protect, getHabitStreak);

export default router;