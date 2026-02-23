import express, { Response } from "express";
import { AuthRequest, protect } from "../middlewares/token";
import habitsModel from "../model/habits.model";

const router = express.Router();

router.post("/create", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, selectedIcon, selectedCategory, selectedFrequency, targetDays, reminderTime, reminderEnabled, } = req.body;

    if (!name || !selectedCategory) {
      return res.status(400).json({
        status: "error",
        message: "Name and Category are required",
      });
    }

    const habit = await habitsModel.create({ user: req.user.id, name, description, icon: selectedIcon, category: selectedCategory, frequency: selectedFrequency, targetDays, reminderTime, reminderEnabled, });

    res.status(201).json({
      status: "success",
      data: habit,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create habit",
    });
  }
});

router.get("/get", protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const habits = await habitsModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    const stats = await habitsModel.aggregate([
      { $match: { user: habits[0]?.user } },
      {
        $group: {
          _id: null,
          totalStreak: { $sum: "$streak" },
          longestStreak: { $max: "$longestStreak" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: habits,
      stats: {
        totalStreak: stats[0]?.totalStreak || 0,
        longestStreak: stats[0]?.longestStreak || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch habits",
    });
  }
});


router.put("/update/:id", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const habit = await habitsModel.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({
        status: "error",
        message: "Habit not found",
      });
    }

    const { name, description, selectedIcon, selectedCategory, selectedFrequency, targetDays, reminderTime, reminderEnabled, } = req.body;

    if (name !== undefined) habit.name = name;
    if (description !== undefined) habit.description = description;
    if (selectedIcon !== undefined) habit.icon = selectedIcon;
    if (selectedCategory !== undefined) habit.category = selectedCategory;
    if (selectedFrequency !== undefined) habit.frequency = selectedFrequency;
    if (targetDays !== undefined) habit.targetDays = targetDays;
    if (reminderTime !== undefined) habit.reminderTime = reminderTime;
    if (reminderEnabled !== undefined) habit.reminderEnabled = reminderEnabled;

    const updatedHabit = await habit.save();

    res.status(200).json({
      status: "success",
      data: updatedHabit,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update habit",
    });
  }
});

router.put("/toggle/:id", protect, async (req: AuthRequest, res: Response) => {
  try {
    const habit = await habitsModel.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    habit.completedToday = !habit.completedToday;

    if (habit.completedToday) {
      habit.streak += 1;
    } else {
      habit.streak = Math.max(0, habit.streak - 1);
    }

    await habit.save();

    res.status(200).json({
      status: "success"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to toggle habit",
    });
  }
});

export default router;
