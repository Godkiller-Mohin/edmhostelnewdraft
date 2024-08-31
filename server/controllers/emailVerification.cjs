const crypto = require('crypto');
const User = require('../models/User.cjs');
const sendEmail = require('../configs/send.mail');
const { errorResponse, successResponse } = require('../configs/app.response');
const APP_SERVICE_URL = process.env.APP_SERVICE_URL;

// Send email verification link
const sendEmailVerificationLink = async (req, res) => {
  try {
    const user = req.user; // Assumes user is authenticated and attached to req

    if (!user) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'User not found'
      ));
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = crypto.createHash('sha256').update(emailVerificationToken).digest('hex');
    user.emailVerificationExpire = Date.now() + 3600000; // Token expires in 1 hour
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const url = `${APP_SERVICE_URL}/auth/verify-email/${emailVerificationToken}`;
    const subjects = 'Email Verification';
    const message = `Click the link below to verify your email address:\n\n${url}`;
    const title = 'Verify Your Email Address';

    // Send email
    sendEmail(res, user, url, subjects, message, title);
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message || error
    ));
  }
};

// Verify email address
const emailVerification = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token and find user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'Email verification token is invalid or has expired'
      ));
    }

    // Verify email
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    user.verified = true;
    await user.save();

    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'Email verified successfully'
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message || error
    ));
  }
};

module.exports = {
  sendEmailVerificationLink,
  emailVerification
};
