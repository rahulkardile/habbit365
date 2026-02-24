import { Response } from "express";
import { AuthRequest } from "../middlewares/token";
import habitsModel from "../model/habits.model";
import habitLogsModel from "../model/habitLogs.model";
import { getFutureDate } from "../utils/getFutureDate";

export const createHabit = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, reminderEnabled, endDate, category, reminderTime, frequency, icon } = req.body;
        
        const habit = await habitsModel.create({
            userId: req.user.id,
            title,
            description,
            category,
            reminderTime,
            frequency,
            startDate: new Date(),
            reminderEnabled,
            endDate: getFutureDate(endDate),
            icon,
        });

        res.status(201).json({
            status: "success",
            data: habit,
        });
    } catch (error: Error | any) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/habits/by-date?date=YYYY-MM-DD
export const getHabitsByDate = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const selectedDateStr =
      req.query.date?.toString() ||
      new Date().toISOString().split("T")[0];

    if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDateStr)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    const startOfDay = new Date(selectedDateStr);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDateStr);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // 1️⃣ Get valid habits for selected date
    const habits = await habitsModel.find({
      userId: req.user.id,
      isActive: true,
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    });

    // 2️⃣ Get logs for selected date
    const logs = await habitLogsModel.find({
      userId: req.user.id,
      date: selectedDateStr,
    });

    const logMap = new Map();
    logs.forEach((log) => {
      logMap.set(log.habitId.toString(), log.completedToday);
    });

    const result = habits.map((habit) => ({
      ...habit.toObject(),
      completedToday: logMap.get(habit._id.toString()) || false,
      date: selectedDateStr,
    }));

    // 3️⃣ Calculate streak (only completed logs)
    const allCompletedLogs = await habitLogsModel
      .find({
        userId: req.user.id,
        completedToday: true,
      })
      .sort({ date: 1 });

    let totalStreak = 0;
    let longestStreak = 0;
    let currentStreak = 0;
    let previousDate: Date | null = null;

    for (const log of allCompletedLogs) {
      const currentDate = new Date(log.date);

      if (!previousDate) {
        currentStreak = 1;
      } else {
        const diff =
          (currentDate.getTime() - previousDate.getTime()) /
          (1000 * 60 * 60 * 24);

        if (diff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }

      longestStreak = Math.max(longestStreak, currentStreak);
      previousDate = currentDate;
    }

    // calculate totalStreak up to selectedDate
    const selectedDateObj = new Date(selectedDateStr);
    previousDate = null;
    totalStreak = 0;

    const filteredLogs = allCompletedLogs.filter(
      (log) => new Date(log.date) <= selectedDateObj
    );

    for (let i = filteredLogs.length - 1; i >= 0; i--) {
      const currentDate = new Date(filteredLogs[i].date);

      if (!previousDate) {
        totalStreak = 1;
        previousDate = currentDate;
        continue;
      }

      const diff =
        (previousDate.getTime() - currentDate.getTime()) /
        (1000 * 60 * 60 * 24);

      if (diff === 1) {
        totalStreak++;
        previousDate = currentDate;
      } else {
        break;
      }
    }

    res.json({
      status: "success",
      selectedDate: selectedDateStr,
      total: result.length,
      streak: {
        totalStreak,
        longestStreak,
      },
      data: result,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/habits/:habitId/complete
export const toggleHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    console.log(`userId: ${userId}, habitId: ${habitId}, date: ${today}`);
    
    // Check if already completed
    const existingLog = await habitLogsModel.findOne({
      habitId,
      userId,
      date: today,
    });

    // If exists → remove (toggle off)
    if (existingLog) {
      await habitLogsModel.deleteOne({ _id: existingLog._id });

      return res.json({
        status: "success",
        message: "Habit uncompleted",
        data: { toggled: false },
      });
    }

    // If not exists → create completed log
    const newLog = await habitLogsModel.create({
      habitId,
      userId,
      date: today,
      completedToday: true,
      completedAt: new Date(),
    });

    return res.json({
      status: "success",
      message: "Habit completed",
      data: { toggled: true, log: newLog },
    });
  } catch (error: Error | any) {
    console.log("Error in toggleHabit:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/habits/calendar?month=02&year=2026
export const getCalendarData = async (req: AuthRequest, res: Response) => {
    try {
        const { month, year } = req.query;

        const start = `${year}-${month}-01`;
        const end = `${year}-${month}-31`;

        const logs = await habitLogsModel.find({
            userId: req.user.id,
            date: { $gte: start, $lte: end },
        }).select("date status");

        res.json({
            status: "success",
            data: logs,
        });
    } catch (error : Error | any) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/habits/:habitId/streak
export const getHabitStreak = async (req: AuthRequest, res: Response) => {
    try {
        const { habitId } = req.params;

        const logs = await habitLogsModel.find({
            habitId,
            status: "completed",
        }).sort({ date: -1 });

        let streak = 0;
        let prevDate = null;

        for (const log of logs) {
            const current = new Date(log.date);

            if (!prevDate) {
                streak++;
                prevDate = current;
                continue;
            }

            const diff =
                (prevDate.getTime() - current.getTime()) /
                (1000 * 60 * 60 * 24);

            if (diff === 1) {
                streak++;
                prevDate = current;
            } else {
                break;
            }
        }

        res.json({ status: "success", streak });
    } catch (error : Error | any) {
        res.status(500).json({ message: error.message });
    }
};
