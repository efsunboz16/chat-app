import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        
        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
        }
        
        
        res.status(201).json({
            message: "User created successfully",
            user: {
                email,
                fullName,
                _id: newUser._id
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create user",
            error
        });
    }
};

export const login = async (req, res) => {
   try {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid password"
        });
    }

    generateToken(user._id, res);



    res.status(200).json({
        message: "User logged in successfully",
        user: {
            email,
            fullName: user.fullName,
            _id: user._id
        }
    });

    
   } catch (error) {
    res.status(500).json({
        message: "Failed to login user",
        error: error.message
    });
   }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to logout user",
            error
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({
                message: "Profile picture is required"
            });
        }

        const uploadResponse = await cloudinary.v2.uploader.upload(profilePic, {
            folder: "profile_pictures"
        });
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePicture: uploadResponse.secure_url
        }, {new: true});

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json({
            message: "User is authenticated",
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to check authentication",
            error
        });
    }
};