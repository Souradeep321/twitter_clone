import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';

// models
import { Notification } from "../models/notification.models.js";
import { User } from "../models/user.models.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params
    try {
        const user = await User.findOne({ username }).select("-password");

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);

        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow/unfollow yourself" });
        }

        if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // unfollow the user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User Unfollowed successfully",user: userToModify._id });
        } else {
            // follow the user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            // TODO: send notification to the user
            const notification = new Notification({
                from: req.user._id,
                to: userToModify._id,
                type: "follow"
            });

            await notification.save()

            // TODO: return the id of the user as response
            res.status(200).json({ message: "User Followed successfully", 
                user: userToModify._id });
        }

    } catch (error) {
        console.log("Error in followUnfollowUser controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getSuggestedUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                },
            },
            { $sample: { size: 10 } },
        ]);

        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach((user) => (user.password = null));

        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log("Error in getSuggestedUser controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUser = async (req, res) => {
    const { username, email, fullName, currentPassword, newPassword, bio, link } = req.body
    let { profileImg, coverImg } = req.body
    try {
        let user = await User.findById(req.user?._id);

        if (!user) return res.status(404).json({ error: "User not found" });

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

            if (newPassword.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long" });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg) {
            // Destroying cloudinary image
			if (user.profileImg) {
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}
			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}
			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

        user.fullName = fullName || user.fullName
        user.username = username || user.username
        user.email = email || user.email
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        user = await user.save()
        // password should be null in response
        user.password = null

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateUser controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}