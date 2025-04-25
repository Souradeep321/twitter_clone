import { Router } from "express";
import { protectRoute } from "../middleware/protectedRoute.js";
import { deleteNotifications, deleteOneNotification, getNotifications } from "../controller/notification.controllers.js";

const router = Router();

router.route("/").get(protectRoute, getNotifications);
router.route("/").delete(protectRoute, deleteNotifications);
router.route("/:id").delete(protectRoute, deleteOneNotification);

export default router