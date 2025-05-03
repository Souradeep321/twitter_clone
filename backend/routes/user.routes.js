import express from "express";
import { protectRoute } from "../middleware/protectedRoute.js";
import { followUnfollowUser, getSuggestedUser, getUserProfile, updateUser } from "../controller/user.controllers.js";

const router = express.Router()


router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.patch("/update", protectRoute, updateUser);



export default router