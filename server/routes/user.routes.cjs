const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { isAuthenticatedUser, isAdmin, isBlocked } = require('../middleware/app.authentication.cjs');
const {
  getUser,
  updateUser,
  deleteUser,
  avatarUpdate,
  getUsersList,
  blockedUser,
  unblockedUser,
  getUserById,
  deleteUserById
} = require('../controllers/user.cjs');

const router = express.Router();

// Routes for getting user information
router.get("/get-user", isAuthenticatedUser, isBlocked, getUser);
router.get("/get-user/:id", isAuthenticatedUser, isBlocked, isAdmin, getUserById);

// Routes for updating user information
router.put("/update-user", isAuthenticatedUser, isBlocked, updateUser);

// Routes for deleting a user
router.delete("/delete-user", isAuthenticatedUser, isBlocked, deleteUser);
router.delete("/delete-user/:id", isAuthenticatedUser, isBlocked, isAdmin, deleteUserById);

// Routes for getting all users list for admin
router.get("/all-users-list", isAuthenticatedUser, isBlocked, isAdmin, getUsersList);

// Routes for blocking/unblocking a user by admin
router.put("/blocked-user/:id", isAuthenticatedUser, isBlocked, isAdmin, blockedUser);
router.put("/unblocked-user/:id", isAuthenticatedUser, isBlocked, isAdmin, unblockedUser);

module.exports = router;
