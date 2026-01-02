import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { JWT_SECRET } from "../config/config.js";

const createToken = (userId) => {
  return jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ------------------------------------------------
   REGISTER
------------------------------------------------ */
export const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    const user = await User.create({
      email,
      username,
      password,
    });

    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------------------------------------
   LOGIN
------------------------------------------------ */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createToken(user._id);

    // Cookie for browser auth
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------------------------------------
   GET CURRENT USER  ✅ REQUIRED
------------------------------------------------ */
export const getMe = async (req, res) => {
  try {
    // req.user is set by authenticate middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------------------------------------
   LOGOUT
------------------------------------------------ */
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
