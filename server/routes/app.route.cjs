const express = require('express');
const { getDashboardData }=require ("../controllers/apps.controllers.cjs");
const  { isAuthenticatedUser, isBlocked, isAdmin }=require ("../middleware/app.authentication.cjs");

const router = express.Router();

// Get dashboard info by admin
router.get("/dashboard", isAuthenticatedUser, isBlocked, isAdmin, getDashboardData);

export default router;
