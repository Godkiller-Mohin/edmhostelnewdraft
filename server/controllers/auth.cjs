const fs = require('fs');
const crypto = require('crypto');
const appRoot = require('app-root-path');
const bcrypt = require('bcrypt');
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
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h',
  });
};

const generateJWTRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: '7d', // Refresh tokens typically have a longer expiration time
  });
};


// Helper function to delete uploaded files
const deleteUploadedFile = (filename) => {
  const filePath = appRoot.path + `/uploads/users/${filename}`;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Registration controller
const register = async (req, res) => {
  try {
    const { userName, fullName, email, phone, password, dob, address, gender, role } = req.body;

    // Check if all required fields are provided
    if (!userName || !fullName || !email || !password || !dob || !address) {
      if (req?.file?.filename) {
        deleteUploadedFile(req.file.filename);
      }
      return res.status(400).json(errorResponse(1, 'FAILED', 'Please enter all required fields'));
    }

    // Check if userName, email, or phone already exists
    const [findUserName, findEmail, findPhone] = await Promise.all([
      User.findOne({ userName }),
      User.findOne({ email }),
      User.findOne({ phone }),
    ]);

    if (findUserName || findEmail || findPhone) {
      if (req?.file?.filename) {
        deleteUploadedFile(req.file.filename);
      }

      const errorMsg = findUserName ? 'Username already exists' :
                        findEmail ? 'Email already exists' :
                        'Phone number already exists';

      return res.status(409).json(errorResponse(9, 'ALREADY EXIST', `Sorry, ${errorMsg}`));
    }

    // Encrypt the password before saving the user
    //const hashedPassword = await bcrypt.hash(password, 10);

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
    return res.status(201).json(successResponse(
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

  } catch (error) {
    console.error('Registration error:', error);
    if (req?.file?.filename) {
      deleteUploadedFile(req.file.filename);
    }
    return res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error.message || 'Internal Server Error'));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { loginType } = req.query;

    if (!email || !password) {
      return res.status(400).json(errorResponse(1, 'FAILED', 'Please enter email and password'));
    }
  
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'User does not exist'));
    }

    // Check login type if provided
    if (loginType === 'admin' && user.role !== 'admin') {
      return res.status(406).json(errorResponse(6, 'UNABLE TO ACCESS', 'Access forbidden'));
    }

    // Check if the user is blocked
    if (user.status === 'blocked') {
      return res.status(406).json(errorResponse(6, 'UNABLE TO ACCESS', 'User is blocked'));
    }

    //Compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
     console.log('Password comparison failed');
     return res.status(400).json(errorResponse(1, 'FAILED', 'User credentials are incorrect'));
   }
  
    // Generate tokens
    const accessToken = generateJWTToken(user);
    const refreshToken = generateJWTRefreshToken(user);

    // Update user status to 'login'
    await User.findByIdAndUpdate(user._id, { status: 'login', updatedAt: Date.now() }, { new: true });

    // Send the response
    return res.status(200).json(successResponse(0, 'SUCCESS', 'User logged in successfully', {
      accessToken,
      refreshToken,
      user
    }));
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json(errorResponse(1, 'FAILED', error.message || 'Internal Server Error'));
  }
};




// Logout controller
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

// Forgot password controller
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

// Reset password controller
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

      user.password = await bcrypt.hash(req.body.password, 10);
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

// Change password controller
const changePassword = async (req, res) => {
  try {
    if (req.body.oldPassword && req.body.newPassword) {
      const { user } = req;

      if (!user) {
        return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'User does not exist'));
      }

      const user2 = await User.findOne({ email: user.email }).select('+password');

      const isPasswordMatch = await bcrypt.compare(req.body.oldPassword, user2.password);
      if (!isPasswordMatch) {
        return res.status(400).json(errorResponse(1, 'FAILED', 'User credentials are incorrect'));
      }

      user.password = await bcrypt.hash(req.body.newPassword, 10);
      await user.save();

      res.status(200).json(successResponse(0, 'SUCCESS', 'User password changed successfully'));
    } else {
      return res.status(400).json(errorResponse(1, 'FAILED', 'Please enter all required fields'));
    }
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error.message || 'Internal Server Error'));
  }
};

// Send email verification link controller
const sendEmailVerificationLink = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'User does not exist'));
    }

    // Check if user is already verified
    if (user.verified) {
      return res.status(400).json(errorResponse(1, 'FAILED', 'Your email is already verified'));
    }

    // Email verification token
    const verificationToken = user.getEmailVerificationToken();

    // Save updated user
    await user.save({ validateBeforeSave: false });

    // Mailing data
    const url = `${process.env.APP_SERVICE_URL}/auth/verify-email/${verificationToken}`;
    const subjects = 'User Email Verification';
    const message = 'Click the link below to verify your email. If you have not requested this email, please ignore it.';
    const title = 'Verify Your Email';

    // Sending mail
    sendEmail(res, user, url, subjects, message, title);
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error.message || 'Internal Server Error'));
  }
};

// Email verification controller
const emailVerification = async (req, res) => {
  try {
    if (req.params.token) {
      // Create token crypto hash
      const emailVerificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

      const user = await User.findOne({
        emailVerificationToken,
        emailVerificationExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'Email verification token is invalid or has expired'));
      }

      // Reset user email verification fields
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;
      user.verified = true;
      await user.save();

      res.status(200).json(successResponse(0, 'SUCCESS', 'User email verification successful'));
    } else {
      return res.status(400).json(errorResponse(1, 'FAILED', 'Please enter all required fields'));
    }
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error.message || 'Internal Server Error'));
  }
};

// Refresh token controller
const refreshToken = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json(errorResponse(4, 'UNKNOWN ACCESS', 'User does not exist'));
    }

    const accessToken = generateJWTToken(user);
    const refreshToken = user.getJWTRefreshToken();

    // Options for cookie
    const options = {
      expires: new Date(Date.now() + process.env.JWT_REFRESH_TOKEN_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true
    };

    res.status(200)
      .cookie('AccessToken', accessToken, options)
      .json(successResponse(0, 'SUCCESS', 'JWT refresh token generated successfully', { accessToken, refreshToken }));
  } catch (error) {
    res.status(500).json(errorResponse(2, 'SERVER SIDE ERROR', error.message || 'Internal Server Error'));
  }
};

module.exports = {
  register,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
  sendEmailVerificationLink,
  emailVerification,
  refreshToken
};
