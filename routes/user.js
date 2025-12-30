import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controller/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register-user", registerUser);
userRouter.post("/login-user", loginUser);

// Protected routes
userRouter.post("/logout-user", authenticate, logoutUser);
userRouter.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    message: "Authenticated user",
    userId: req.user.id,
  });
});

export default userRouter;
