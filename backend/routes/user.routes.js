import { Router } from "express";
import { protectRoute } from "../middleware/protectedRoute.js";
import { followUnfollowUser, getSuggestedUser, getUserProfile, updateUser } from "../controller/user.controllers.js";

const router = Router()

router.route('/profile/:username').get(protectRoute, getUserProfile)
router.route('/suggested').get(protectRoute, getSuggestedUser)
router.route('/follow/:id').post(protectRoute, followUnfollowUser)
router.route('/update').patch(protectRoute, updateUser)


export default router