import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export const authenticate = (req, res, next) => {
  let token;

  // 1. Authorization header
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Cookie
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  // 3. No token
  if (!token) {
    return res.status(403).json({
      message: "Access denied, please login",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded._id };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
