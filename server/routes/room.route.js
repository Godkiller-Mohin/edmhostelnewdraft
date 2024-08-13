
import express from "express";
import roomImageUpload from "../middleware/room.image.uploader.js";
import { isAuthenticatedUser, isAdmin } from "../middleware/app.authentication.js";

import { 
  createRoom, 
  getRoomsList, 
  getRoomByIdOrSlugName, 
  editRoomByAdmin, 
  deleteRoomById, 
  getFeaturedRoomsList 
} from "../controllers/room.controller.js";

const router = express.Router();

// Route for creating a new room
router.post("/create-room", isAuthenticatedUser, isAdmin, roomImageUpload.array('room_images', 5), createRoom);

// Routes for getting all rooms, a single room by ID or slug name, and featured rooms list
router.get("/all-rooms-list", getRoomsList);
router.get("/get-room-by-id-or-slug-name/:id", getRoomByIdOrSlugName);
router.get("/featured-rooms-list", getFeaturedRoomsList);

// Routes for editing and deleting a room by admin
router.put("/edit-room/:id", isAuthenticatedUser, isAdmin, roomImageUpload.array('room_images', 5), editRoomByAdmin);
router.delete("/delete-room/:id", isAuthenticatedUser, isAdmin, deleteRoomById);

export default router;

