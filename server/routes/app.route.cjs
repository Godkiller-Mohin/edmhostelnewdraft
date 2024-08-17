const express = require('express');
const { getDashboardData }=require ("../controllers/apps.controllers.js");
const  { isAuthenticatedUser, isBlocked, isAdmin }=require ("../middleware/app.authentication.js");

const router = express.Router();

// Get dashboard info by admin
router.get("/dashboard", isAuthenticatedUser, isBlocked, isAdmin, getDashboardData);

export default router;
