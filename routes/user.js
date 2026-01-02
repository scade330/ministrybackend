import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { loginUser, getMe } from "../controller/userController.js";

const userRouter = express.Router();

// Public route
userRouter.post("/login-user", loginUser);

// Protected route
userRouter.get("/me", authenticate, getMe);

export default userRouter;
