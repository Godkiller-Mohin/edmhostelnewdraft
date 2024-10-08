const jwt = require('jsonwebtoken');
const { createError } = require('../error.cjs');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) return next(createError(401, "You are not authenticated!"));

    // Get the token from the header
    const token = req.headers.authorization.split(" ")[1];

    // Check if token exists
    if (!token) return next(createError(401, "You are not authenticated!"));

    // Verify the token
    const decode = await jwt.verify(token, process.env.JWT);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(402).json({ error: error.message });
  }
};

module.exports = { verifyToken };
