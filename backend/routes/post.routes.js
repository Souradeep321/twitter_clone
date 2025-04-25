import { Router } from "express";
import { protectRoute } from "../middleware/protectedRoute.js";
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from "../controller/post.controllers.js";

const router = Router();

router.route('/all').get(protectRoute, getAllPosts);
router.route('/following').get(protectRoute, getFollowingPosts);
router.route('/likes/:id').get(protectRoute, getLikedPosts);
router.route('/user/:username').get(protectRoute, getUserPosts);
router.route('/create').post(protectRoute, createPost);
router.route('/like/:id').post(protectRoute, likeUnlikePost);
router.route('/comment/:id').post(protectRoute, commentOnPost);
router.route('/:id').delete(protectRoute, deletePost);

export default router