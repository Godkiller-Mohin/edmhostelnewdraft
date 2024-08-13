import express from "express";
import { getDashboardData } from "../controllers/apps.controllers.js";
import { isAuthenticatedUser, isBlocked, isAdmin } from "../middleware/app.authentication.js";

const router = express.Router();

// Get dashboard info by admin
router.get("/dashboard", isAuthenticatedUser, isBlocked, isAdmin, getDashboardData);

export default router;
