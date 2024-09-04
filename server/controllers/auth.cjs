const fs = require('fs');
const crypto = require('crypto');
const appRoot = require('app-root-path');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');
const logger = require('../middleware/winston.logger.cjs');
const { errorResponse, successResponse } = require('../configs/app.response');
const loginResponse = require('../configs/login.response');
const sendEmail = require('../configs/send.mail');
// Ensure dotenv is loaded to access environment variables
require('dotenv').config();

// Helper function to generate JWT
const generateJWTToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// TODO: Controller for registering a new user
const register = async (req, res) => {
  try {
    const {
      userName, fullName, email, phone, password, dob, address, gender, role
    } = req.body;

    if (userName && fullName && email && password && dob && address) {
      // Check if userName, email, or phone already exists
      const findUserName = await User.findOne({ userName });
      const findEmail = await User.findOne({ email });
      const findPhone = await User.findOne({ phone });

      if (findUserName || findEmail || findPhone) {
        // Delete uploaded avatar image if it exists
        if (req?.file?.filename) {
          fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
            if (err) { logger.error(err); }
          });
        }

        const errorMsg = findUserName ? 'Username already exists' :
                          findEmail ? 'Email already exists' :
                          'Phone number already exists';

        return res.status(409).json(errorResponse(9, 'ALREADY EXIST', `Sorry, ${errorMsg}`));
      }

      // Create a new user and store in the database
      const user = await User.create({
        userName,
        fullName,
        email,
        phone,
        password,
        avatar: req.file ? `/uploads/users/${req.file.filename}` : '/avatar.png',
        gender,
        dob,
        address,
        role
      });

      // Success response with the registered new user
      res.status(201).json(successResponse(
        0,
        'SUCCESS',
        'User registered successfully',
        {
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          avatar: process.env.APP_BASE_URL + user.avatar,
          gender: user.gender,
          dob: user.dob,
          address: user.address,
          role: user.role,
          verified: user.verified,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      ));
    } else {
      // Delete uploaded avatar image if it exists
      if (req?.file?.filename) {
        fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
          if (err) { logger.error(err); }
        });
      }

      return res.status(400).json(errorResponse(1, 'FAILED', 'Please enter all required fields'));
    }
  } catch (error) {
    // Delete uploaded avatar image if it exists
    if (req?.file?.filename) {
      fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
        if (err) { logger.error(err); }
      });
    }

    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error.message || 'Internal Server Error'));
  }
};

// TODO: Controller for logging in an existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { loginType } = req.query;

    if (!email || !password) {
      return res.status(400).json(errorResponse(1, 'FAILED', 'Please enter email and password'));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'User does not exist'));
    }

    if (loginType === 'admin' && user.role !== 'admin') {
      return res.status(406).json(errorResponse(6, 'UNABLE TO ACCESS', 'Access forbidden'));
    }

    if (user.status === 'blocked') {
      return res.status(406).json(errorResponse(6, 'UNABLE TO ACCESS', 'Access forbidden'));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json(errorResponse(1, 'FAILED', 'User credentials are incorrect'));
    }

    const logUser = await User.findByIdAndUpdate(user._id, { status: 'login', updatedAt: Date.now() }, { new: true });

    // Response user with JWT access token
    const token = generateJWTToken(logUser);
    res.status(200).json(successResponse(0, 'SUCCESS', 'User logged in successfully', { token }));
  } catch (error) {
    res.status(500).json(errorResponse(1, 'FAILED', error.message || 'Internal Server Error'));
  }
};

// TODO: Controller for logging out a user
const logoutUser = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'Unauthorized access. Please login to continue'));
    }

    await User.findByIdAndUpdate(user._id, { status: 'logout', updatedAt: Date.now() }, { new: true });
    res.clearCookie('AccessToken');

    res.status(200).json(successResponse(0, 'SUCCESS', 'User logged out successfully'));
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error.message || 'Internal Server Error'));
  }
};

// TODO: Controller for user forgot password
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'User does not exist'));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const url = `${process.env.APP_SERVICE_URL}/auth/forgot-password/${resetToken}`;
    const subjects = 'Password Recovery Email';
    const message = 'Click the link below to reset your password. If you did not request this, please ignore this email.';
    const title = 'Recover Your Password';

    sendEmail(res, user, url, subjects, message, title);
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error.message || 'Internal Server Error'));
  }
};

// TODO: Controller for user reset password
const resetPassword = async (req, res) => {
  try {
    if (req.params.token && req.body.password && req.body.confirmPassword) {
      const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'Reset Password Token is invalid or has expired'));
      }

      if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json(errorResponse(1, 'FAILED', 'Password and Confirm password do not match'));
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(200).json(successResponse(0, 'SUCCESS', 'User password reset successfully'));
    } else {
      return res.status(400).json(errorResponse(1, 'FAILED', 'Please enter all required fields'));
    }
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error.message || 'Internal Server Error'));
  }
};

// TODO: Controller for user change password
const changePassword = async (req, res) => {
  try {
    if (req.body.oldPassword && req.body.newPassword) {
      const { user } = req;

      if (!user) {
        return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'User does not exist'));
      }

      const user2 = await User.findOne({ email: user.email }).select('+password');

      const isPasswordMatch = await user2.comparePassword(req.body.oldPassword.toString());
      if (!isPasswordMatch) {
        return res.status(400).json(errorResponse(1, 'FAILED', 'User credentials are incorrect'));
      }

      user.password = req.body.newPassword;
      await user.save();

      res.status(200).json(successResponse(0, 'SUCCESS', 'User password changed successfully'));
    } else {
      return res.status(400).json(errorResponse(1, 'FAILED', 'Please enter all required fields'));
    }
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error.message || 'Internal Server Error'));
  }
};
// TODO: Controller for user email verification link send
const sendEmailVerificationLink = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'User does not exist'
      ));
    }

    // check user already verified
    if (user.verified) {
      return res.status(400).json(errorResponse(
        1,
        'FAILED',
        'Ops! Your mail already verified'
      ));
    }

    // email verification token
    const verificationToken = user.getEmailVerificationToken();

    // save updated user
    await user.save({ validateBeforeSave: false });

    // mailing data
    const url = `${process.env.APP_SERVICE_URL}/auth/verify-email/${verificationToken}`;
    const subjects = 'User Email Verification';
    const message = 'Click below link to verify your email. If you have not requested this email simply ignore this email.';
    const title = 'Verify Your Email';

    // sending mail
    sendEmail(res, user, url, subjects, message, title);
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error
    ));
  }
};

// TODO: Controller for user email verification
const emailVerification = async (req, res) => {
  try {
    if (req.params.token) {
      // creating token crypto hash
      const emailVerificationToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

      const user = await User.findOne({
        emailVerificationToken,
        emailVerificationExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(404).json(errorResponse(
          4,
          'UNKNOWN ACCESS',
          'Email verification token is invalid or has been expired'
        ));
      }

      // reset user password in database
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      user.verified = true;
      await user.save();

      res.status(200).json(successResponse(
        0,
        'SUCCESS',
        'User email verification successful'
      ));
    } else {
      return res.status(400).json(errorResponse(
        1,
        'FAILED',
        'Please enter all required fields'
      ));
    }
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error
    ));
  }
};

// TODO: Controller for user refresh-token
const refreshToken = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'User does not exist'
      ));
    }

    const accessToken = user.getJWTToken();
    const refreshToken = user.getJWTRefreshToken();

    // options for cookie
    const options = {
      expires: new Date(Date.now() + process.env.JWT_TOKEN_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true
    };

    res
      .status(200)
      .cookie('AccessToken', accessToken, options)
      .json(successResponse(
        0,
        'SUCCESS',
        'JWT refreshToken generate successful',
        { accessToken, refreshToken }
      ));
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error
    ));
  }
};
module.exports = {
  register, loginUser, logoutUser, forgotPassword, resetPassword, changePassword, sendEmailVerificationLink, emailVerification, refreshToken
}
