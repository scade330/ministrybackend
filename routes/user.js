import express from 'express';
import { LoginUser, registerUser } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/register-user', registerUser);
userRouter.post('/login-user', LoginUser);

export default userRouter;