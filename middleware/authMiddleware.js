import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export const authenticate = (req, res, next) => {
  // ✅ Allow CORS preflight requests to pass
  if (req.method === "OPTIONS") {
    return next();
  }

  let token;

  // 1️⃣ Check Authorization header
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ Check cookies
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  // 3️⃣ No token → user not authenticated
  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    // 4️⃣ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 5️⃣ Attach user info to request
    req.user = {
      id: decoded._id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
