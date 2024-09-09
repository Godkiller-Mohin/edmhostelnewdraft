const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const { errorResponse } = require('../configs/app.response');
const User = require('../models/User.cjs');

// Middleware for detecting authenticated logged-in users
const isAuthenticatedUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    console.log("Received Headers:", req.headers); // Log all headers

    if (!authorization) {
      return res.status(403).json(errorResponse(
        3,
        'ACCESS FORBIDDEN',
        'Authorization header is required'
      ));
    }

    if (!authorization.startsWith('Bearer ')) {
      return res.status(400).json(errorResponse(
        4,
        'INVALID AUTHORIZATION HEADER',
        'Authorization header format must be: Bearer <token>'
      ));
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      return res.status(400).json(errorResponse(
        4,
        'INVALID TOKEN',
        'Token not found in the Authorization header'
      ));
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json(errorResponse(
          11,
          'JWT TOKEN INVALID',
          'JWT token is expired/invalid. Please logout and login again'
        ));
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json(errorResponse(
          4,
          'USER NOT FOUND',
          'User associated with the provided JWT token does not exist'
        ));
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message
    ));
  }
};




// Middleware for validating user's JWT refresh token
const isRefreshTokenValid = async (req, res, next) => {
  try {
    // Get refresh token from authorization headers
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(403).json(errorResponse(
        3,
        'ACCESS FORBIDDEN',
        'Authorization headers is required'
      ));
    }

    // Ensure authorization header is in the correct format
    if (!authorization.startsWith('Bearer ')) {
      return res.status(400).json(errorResponse(
        4,
        'INVALID AUTHORIZATION HEADER',
        'Authorization header format must be: Bearer <token>'
      ));
    }

    // Extract the token from the authorization header
    const token = authorization.split(' ')[1];  // Don't hardcode the token

    // Verify refresh token
    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json(errorResponse(
          11,
          'JWT TOKEN INVALID',
          'JWT token is expired/invalid. Please logout and login again'
        ));
      }

      // Check if user exists
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json(errorResponse(
          4,
          'UNKNOWN ACCESS',
          'Authorization headers is missing/invalid'
        ));
      }

      // Check if user is logged in
      if (user.status === 'login') {
        req.user = user;
        next();
      } else {
        return res.status(401).json(errorResponse(
          1,
          'FAILED',
          'Unauthorized access. Please login to continue'
        ));
      }
    });
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message
    ));
  }
};

// Middleware for checking if user is admin
const isAdmin = async (req, res, next) => {
  try {
    // Get user from request object
    const { user } = req;

    if (!user) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'Sorry, User does not exist'
      ));
    }

    // Check if user role is admin
    if (user.role === 'admin') {
      next();
    } else {
      return res.status(406).json(errorResponse(
        6,
        'UNABLE TO ACCESS',
        'Accessing the page or resource you were trying to reach is forbidden'
      ));
    }
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message
    ));
  }
};

// Middleware for checking if user is blocked
const isBlocked = async (req, res, next) => {
  try {
    // Get user from request object
    const { user } = req;

    if (!user) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'Sorry, User does not exist'
      ));
    }

    // Check if user is blocked
    if (user.role !== 'blocked') {
      next();
    } else {
      return res.status(406).json(errorResponse(
        6,
        'UNABLE TO ACCESS',
        'Accessing the page or resource you were trying to reach is forbidden'
      ));
    }
  } catch (error) {
    res.status(500).json(errorResponse(
      2,
      'SERVER SIDE ERROR',
      error.message
    ));
  }
};

module.exports = {
  isAuthenticatedUser, 
  isBlocked,
  isRefreshTokenValid, 
  isAdmin 
};
