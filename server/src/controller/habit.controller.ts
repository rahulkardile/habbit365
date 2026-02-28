import { Response } from "express";
import { AuthRequest } from "../middlewares/token";
import habitsModel from "../model/habits.model";
import habitLogsModel from "../model/habitLogs.model";
import { formatDateLocal, getFutureDate } from "../utils/utils";

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
    const today = formatDateLocal(new Date());

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

// GET /api/habits/analytics
export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const weeklyData = [];

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const allLogs = await habitLogsModel.find({
      userId,
      date: {
        $gte: formatDateLocal(sevenDaysAgo),
        $lte: formatDateLocal(today),
      },
    });

    const activeHabits = await habitsModel.find({
      userId,
      isActive: true,
    });

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dateStr = formatDateLocal(date);

      const completedCount = allLogs.filter(
        (log) => log.date === dateStr && log.completedToday
      ).length;

      const totalHabits = activeHabits.filter(
        (habit) =>
          habit.startDate <= date && habit.endDate >= date
      ).length;

      weeklyData.push({
        date: dateStr,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        completed: completedCount,
        total: totalHabits,
        percentage:
          totalHabits > 0
            ? Math.round((completedCount / totalHabits) * 100)
            : 0,
      });
    }

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyHeatmap = [];

    for (
      let d = new Date(startOfMonth);
      d <= endOfMonth;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = formatDateLocal(d);

      const completedCount = await habitLogsModel.countDocuments({
        userId,
        date: dateStr,
        completedToday: true,
      });

      const totalHabits = await habitsModel.countDocuments({
        userId,
        isActive: true,
        startDate: { $lte: d },
        endDate: { $gte: d },
      });

      const intensity =
        totalHabits > 0 ? completedCount / totalHabits : 0;

      monthlyHeatmap.push({
        day: d.getDate(),
        intensity,
        completed: completedCount > 0,
      });
    }

    const habits = await habitsModel.find({ userId, isActive: true });

    const habitStats = [];

    for (const habit of habits) {
      const totalLogs = await habitLogsModel.countDocuments({
        userId,
        habitId: habit._id,
      });

      const completedLogs = await habitLogsModel.countDocuments({
        userId,
        habitId: habit._id,
        completedToday: true,
      });

      const completion =
        totalLogs > 0 ? completedLogs / totalLogs : 0;

      // simple streak calc
      const logs = await habitLogsModel
        .find({
          userId,
          habitId: habit._id,
          completedToday: true,
        })
        .sort({ date: -1 });

      let streak = 0;
      let previousDate: Date | null = null;

      for (const log of logs) {
        const currentDate = new Date(log.date);

        if (!previousDate) {
          streak = 1;
        } else {
          const diff =
            (previousDate.getTime() - currentDate.getTime()) /
            (1000 * 60 * 60 * 24);

          if (diff === 1) streak++;
          else break;
        }

        previousDate = currentDate;
      }

      habitStats.push({
        name: habit.title,
        icon: habit.icon,
        completion,
        streak,
        trend: "+0%", // optional future logic
      });
    }

    res.json({
      status: "success",
      weeklyData,
      monthlyHeatmap,
      habitStats,
    });
  } catch (error: any) {
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
  } catch (error: Error | any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/habits/calendar?month=02&year=2026
export const getCalendarData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.query.year as string);
    const month = parseInt(req.query.month as string); // 0-based

    if (isNaN(year) || isNaN(month)) {
      return res.status(400).json({ message: "Invalid year or month" });
    }

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const firstDay = startOfMonth.getDay(); // 0-6 (Sun-Sat)
    const daysInMonth = endOfMonth.getDate();

    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    // Fetch habits active in this month range
    const habits = await habitsModel.find({
      userId,
      isActive: true,
      startDate: { $lte: endOfMonth },
      endDate: { $gte: startOfMonth },
    });

    // Fetch logs for this month
    const logs = await habitLogsModel.find({
      userId,
      date: {
        $gte: formatDate(startOfMonth),
        $lte: formatDate(endOfMonth),
      },
    });

    const cells: any[] = [];
    let completedDays = 0;
    let totalTrackedDays = 0;

    // Add leading empty cells
    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null, status: "none" });
    }

    // Build actual calendar days
    for (let d = 1; d <= daysInMonth; d++) {
      const current = new Date(year, month, d);
      const dateStr = formatDate(current);
      const today = new Date();

      const isFuture = current > today;

      const activeHabits = habits.filter(
        (h) => h.startDate <= current && h.endDate >= current
      );

      const dayLogs = logs.filter(
        (l) => l.date === dateStr && l.completedToday
      );

      let status: "completed" | "partial" | "missed" | "future" | "none";

      if (isFuture) {
        status = "future";
      } else if (activeHabits.length === 0) {
        status = "missed";
      } else if (dayLogs.length === activeHabits.length) {
        status = "completed";
        completedDays++;
        totalTrackedDays++;
      } else if (dayLogs.length > 0) {
        status = "partial";
        totalTrackedDays++;
      } else {
        status = "missed";
        totalTrackedDays++;
      }

      cells.push({
        day: d,
        status,
      });
    }

    return res.json({
      status: "success",
      year,
      month,
      firstDay,
      daysInMonth,
      summary: {
        completedDays,
        totalTrackedDays,
        successRate:
          totalTrackedDays > 0
            ? Math.round((completedDays / totalTrackedDays) * 100)
            : 0,
      },
      cells,
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 8 night off 1 morning 
1080


2280 + 880 