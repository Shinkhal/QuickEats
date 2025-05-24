import express from "express";
import {
  loginUser,
  registerUser,
  registerAdmin,
  loginAdmin,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  changePassword
} from "../controllers/userController.js";
import { submitQuery, getQueries } from "../controllers/queryController.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminAuth.js";

const userRouter = express.Router();

// Public routes (no authentication required)
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Admin routes (separate endpoints for admin panel)
userRouter.post("/admin/register", registerAdmin);
userRouter.post("/admin/login", loginAdmin);

// Protected user routes (authentication required)
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.put("/profile", authMiddleware, updateUserProfile);
userRouter.post("/change-password", authMiddleware, changePassword);
userRouter.post("/submit-query", authMiddleware, submitQuery);
userRouter.get("/queries", adminMiddleware, getQueries);

// Admin-only routes (admin authentication required)
userRouter.get("/admin/users", adminMiddleware, getAllUsers);
// In your order routes file


export default userRouter;