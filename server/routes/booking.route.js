import express from "express";
import { 
  placedBookingOrder, 
  getBookingOrderByUserId, 
  cancelSelfBookingOrder, 
  getBookingOrderForAdmin, 
  updatedBookingOrderByAdmin 
} from "../controllers/booking.controller.js";
import { 
  isAuthenticatedUser, 
  isBlocked, 
  isAdmin 
} from "../middleware/app.authentication.js";

const router = express.Router();

// Route for placing a room booking order
router.post("/placed-booking-order/:id", isAuthenticatedUser, isBlocked, placedBookingOrder);

// Routes for a user to get booking list and cancel a booking order
router.get("/get-user-booking-orders", isAuthenticatedUser, isBlocked, getBookingOrderByUserId);
router.put("/cancel-booking-order/:id", isAuthenticatedUser, isBlocked, cancelSelfBookingOrder);

// Routes for admin to get all booking lists, reject, approve, and checkout placed orders
router.get("/get-all-booking-orders", isAuthenticatedUser, isBlocked, isAdmin, getBookingOrderForAdmin);
router.put("/updated-booking-order/:id", isAuthenticatedUser, isBlocked, isAdmin, updatedBookingOrderByAdmin);

export default router;