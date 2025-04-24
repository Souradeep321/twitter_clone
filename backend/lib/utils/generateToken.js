import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
    res.cookie("jwt", token, {
        httpOnly: true,   // prevent XSS attack 
        sameSite: "strict", // prevent CSRF
        secure: process.env.NODE_ENV !== "developement",
        maxAge: 15 * 24 * 60 * 60 * 1000  //MS
    })
}