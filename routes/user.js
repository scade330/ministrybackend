import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  loginUser,
  getMe,
} from "../controller/userController.js";

const  userRouter = express.Router();

// Public
 userRouter.post("/login-user", loginUser);

// Protected
 userRouter.get("/me", authenticate, getMe);

export default userRouter;
