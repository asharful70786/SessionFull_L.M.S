import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Session from "../models/Session.js";
const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({
      email,
      password,
      name,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/login", async (req, res) => {
  const sessionId = req.signedCookies.sid;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ message: "Session not found" });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    session.userId = user._id;
    session.expires = Math.round(Date.now() / 1000) + 60 * 60 * 24 * 12;
    await session.save();

    res.cookie("sid", session._id, {
      httpOnly: true,
      signed: true,
      maxAge: Math.round(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });

    return res.status(200).json({ message: "User login successfully" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});


export default router;
