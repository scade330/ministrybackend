import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export const authenticate = (req, res, next) => {
  let token;

  // 1. Check Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. If no header, check cookies
  if (!token && req.cookies) {
    token = req.cookies.token;
  }

  if (!token) return res.status(403).json({ error: "Access denied, please login" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains user id
    next();
  } catch (error) {
    console.log("Token error:", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
