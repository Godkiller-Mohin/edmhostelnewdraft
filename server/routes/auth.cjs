const express = require('express');
const { register, loginUser, logoutUser, forgotPassword, resetPassword, changePassword, sendEmailVerificationLink, emailVerification, refreshToken } = require('../controllers/auth.cjs');
const { apiLimiter } = require('../middleware/access.limiter');
const { isAuthenticatedUser, isRefreshTokenValid, isBlocked } = require('../middleware/app.authentication.cjs');

const router = express.Router();

// Routes for register, login, and logout user
router.post('/registration', register);
router.post('/login', apiLimiter, loginUser);
router.post('/logout', isAuthenticatedUser, isBlocked, logoutUser);

// Routes for forgot & change password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password', isAuthenticatedUser, isBlocked, changePassword);

// Routes for user email verification
router.post('/send-email-verification-link', isAuthenticatedUser, isBlocked, sendEmailVerificationLink);
router.post('/verify-email/:token', isAuthenticatedUser, isBlocked, emailVerification);

// Route for getting user refresh JWT Token
router.get('/refresh-token', isRefreshTokenValid, refreshToken);

module.exports = router;
