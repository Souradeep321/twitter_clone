import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
    try {
        const { username, fullName, password, email } = req.body

        if (
            [username, fullName, password, email].some((field) => field?.trim() === "")
        ) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const exsistingUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (exsistingUser) {
            if (exsistingUser.email === email) {
                return res.status(400).json({ error: "Email already exists" });
            }
            if (exsistingUser.username === username) {
                return res.status(400).json({ error: "Username already exists" });
            }
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            fullName,
            password: hashedPassword,
            email
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201)
                .json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    email: newUser.email,
                    followers: newUser.followers,
                    following: newUser.following,
                    profileImg: newUser.profileImg,
                    coverImg: newUser.coverImg,
                });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body

        if ([username, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ username })

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid credentials" });

        if (!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid credentials" });

        generateTokenAndSetCookie(user._id, res);

        res.status(200)
            .json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                followers: user.followers,
                following: user.following,
                profileImg: user.profileImg,
                coverImg: user.coverImg
            });
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in getMe controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { signup, login, logout, getMe }