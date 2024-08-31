const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');
const { errorResponse, successResponse } = require('../configs/app.response');

// Refresh JWT Token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies; // Assumes refresh token is stored in cookies

    if (!refreshToken) {
      return res.status(401).json(errorResponse(
        1,
        'UNAUTHORIZED',
        'No refresh token provided'
      ));
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded) {
      return res.status(401).json(errorResponse(
        1,
        'UNAUTHORIZED',
        'Invalid or expired refresh token'
      ));
    }

    // Find the user associated with the refresh token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json(errorResponse(
        4,
        'UNKNOWN ACCESS',
        'User not found'
      ));
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Set the desired expiry time for the access token
    );

    res.status(200).json(successResponse(
      0,
      'SUCCESS',
      'Token refreshed successfully',
      { accessToken }
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
  refreshToken
};
