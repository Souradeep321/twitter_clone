import express from "express";
import { protectRoute } from "../middleware/protectedRoute.js";
import { deleteNotifications, deleteOneNotification, getNotifications } from "../controller/notification.controllers.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id",protectRoute, deleteOneNotification);

export default router