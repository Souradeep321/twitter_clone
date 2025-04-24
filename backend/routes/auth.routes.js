import { Router } from "express";
import { signup, login, logout, getMe } from "../controller/auth.controllers.js"
import { protectRoute } from "../middleware/protectedRoute.js"

const router = Router();

router.route("/me").get(protectRoute,getMe);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router