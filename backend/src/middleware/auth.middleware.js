import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
                error: "No token found"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
                error: "User not found" 
            });
        }
        req.userId = user._id;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized",
            error: error.message
        });
    }
};
