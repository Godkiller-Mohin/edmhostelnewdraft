const express = require('express');
const { register, loginUser, logoutUser, forgotPassword, resetPassword, changePassword, sendEmailVerificationLink, emailVerification, refreshToken } = require('../controllers/auth.cjs');
const { apiLimiter } = require('../middleware/access.limiter');
const { isAuthenticatedUser, isRefreshTokenValid, isBlocked } = require('../middleware/app.authentication.cjs');

const router = express.Router();

// Routes for register, login, and logout user
router.post('/auth/registration', register);
router.post('/auth/login', apiLimiter, loginUser);
router.post('/auth/logout', isAuthenticatedUser, isBlocked, logoutUser);

// Routes for forgot & change password
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password/:token', resetPassword);
router.post('/auth/change-password', isAuthenticatedUser, isBlocked, changePassword);

// Routes for user email verification
router.post('/auth/send-email-verification-link', isAuthenticatedUser, isBlocked, sendEmailVerificationLink);
router.post('/auth/verify-email/:token', isAuthenticatedUser, isBlocked, emailVerification);

// Route for getting user refresh JWT Token
router.get('/auth/refresh-token', isRefreshTokenValid, refreshToken);

module.exports = router;
