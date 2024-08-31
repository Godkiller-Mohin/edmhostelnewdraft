const dotenv = require('dotenv');
dotenv.config();  // Ensure environment variables are loaded

const fs = require('fs');
const crypto = require('crypto');
const appRoot = require('app-root-path');
const User = require('../models/User.cjs');
const logger = require('../middleware/winston.logger.cjs');
const { errorResponse, successResponse } = require('../configs/app.response');
const loginResponse = require('../configs/login.response');
const sendEmail = require('../configs/send.mail');
const jwt = require('jsonwebtoken');

// Ensure environment variables are loaded
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const APP_BASE_URL = process.env.APP_BASE_URL;
const APP_SERVICE_URL = process.env.APP_SERVICE_URL;
const JWT_TOKEN_COOKIE_EXPIRES = process.env.JWT_TOKEN_COOKIE_EXPIRES || 7; // default to 7 days if not set

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET or JWT_REFRESH_SECRET environment variable is not set');
}

// Register new user
const register = async (req, res) => {
  try {
    const {
      userName, fullName, email, phone, password, dob, address, gender, role
    } = req.body;

    if (userName && fullName && email && password && dob && address) {
      const findUserName = await User.findOne({ userName });
      const findEmail = await User.findOne({ email });
      const findPhone = await User.findOne({ phone });

      if (findUserName || findEmail || findPhone) {
        if (req?.file?.filename) {
          fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
            if (err) { logger.error(err); }
          });
        }

        return res.status(409).json(errorResponse(
          9,
          'ALREADY EXIST',
          'Sorry, User details already exist'
        ));
      }

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

      res.status(201).json(successResponse(
        0,
        'SUCCESS',
        'User registered successfully',
        {
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          avatar: APP_BASE_URL + user.avatar,
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
      if (req?.file?.filename) {
        fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
          if (err) { logger.error(err); }
        });
      }

      return res.status(400).json(errorResponse(
        1,
        'FAILED',
        'Please enter all required fields'
      ));
    }
  } catch (error) {
    if (req?.file?.filename) {
      fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
        if (err) { logger.error(err); }
      });
    }

    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message || error
    ));
  }
};

// Login existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { loginType } = req.query;

    if (!email || !password) {
      return res.status(400).json(errorResponse(
        1,
        'FAILED',
        'Please enter email and password'
      ));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'User does not exist'
      ));
    }

    if (loginType === 'admin' && user.role !== 'admin') {
      return res.status(406).json(errorResponse(
        6,
        'UNABLE TO ACCESS',
        'Accessing the page or resource you were trying to reach is forbidden'
      ));
    }

    if (user.status === 'blocked') {
      return res.status(406).json(errorResponse(
        6,
        'UNABLE TO ACCESS',
        'Accessing the page or resource you were trying to reach is forbidden'
      ));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json(errorResponse(
        1,
        'FAILED',
        'User credentials are incorrect'
      ));
    }

    const logUser = await User.findByIdAndUpdate(
      user._id,
      { status: 'login', updatedAt: Date.now() },
      { new: true }
    );

    loginResponse(res, logUser);
  } catch (error) {
    res.status(500).json(errorResponse(
      1,
      'FAILED',
      error.message || error
    ));
  }
};

// Logout user
const logoutUser = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'Unauthorized access. Please login to continue'
      ));
    }

    await User.findByIdAndUpdate(
      user._id,
      { status: 'logout', updatedAt: Date.now() },
      { new: true }
    );

    res.clearCookie('AccessToken');

    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'User logged out successfully'
    ));
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message || error
    ));
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'User does not exist'
      ));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const url = `${APP_SERVICE_URL}/auth/forgot-password/${resetToken}`;
    const subjects = 'Password Recovery Email';
    const message = 'Click below link to reset your password. If you have not requested this email simply ignore this email.';
    const title = 'Recover Your Password';

    sendEmail(res, user, url, subjects, message, title);
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message || error
    ));
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    if (req.params.token && req.body.password && req.body.confirmPassword) {
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(404).json(errorResponse(
          4,
          'UNKNOWN ACCESS',
          'Reset Password Token is invalid or has expired'
        ));
      }

      if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json(errorResponse(
          1,
          'FAILED',
          'Password and Confirm password do not match'
        ));
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(200).json(successResponse(
        0,
        'SUCCESS',
        'User password reset successfully'
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
      error.message || error
    ));
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    if (req.body.oldPassword && req.body.newPassword) {
      const { user } = req;

      if (!user) {
        return res.status(404).json(errorResponse(
          4,
          'UNKNOWN ACCESS',
          'User does not exist'
        ));
      }

      const { email } = user;
      const user2 = await User.findOne({ email }).select('+password');

      if (!user2) {
        return res.status(404).json(errorResponse(
          4,
          'UNKNOWN ACCESS',
          'User does not exist'
        ));
      }

      const isPasswordMatch = await user2.comparePassword(req.body.oldPassword);
      if (!isPasswordMatch) {
        return res.status(400).json(errorResponse(
          1,
          'FAILED',
          'Old password is incorrect'
        ));
      }

      user2.password = req.body.newPassword;
      await user2.save();

      res.status(200).json(successResponse(
        0,
        'SUCCESS',
        'Password changed successfully'
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
      error.message || error
    ));
  }
};

module.exports = {
  register,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword
};
