import express, { Request, Response } from "express";
import User from "../model/user.model";
import { generateToken } from "../utils/generateToken";
import { stat } from "node:fs";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  console.log("Register endpoint hit with data: ", req.body);
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    message: "User registered successfully",
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    }
  });
});


router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    }
  });
});

export default router;
