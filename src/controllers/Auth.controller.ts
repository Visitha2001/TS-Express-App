import jwt, { Secret, SignOptions } from "jsonwebtoken";
import User from "@/models/User";
import { Request, Response } from "express";
import { hashPassword, verifyPassword } from "../security/pw-hash";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "secret";
const JWT_EXPIRE: string | number = process.env.JWT_EXPIRE || "1d";

const generateToken = (id: string): string => {
    const options: SignOptions = { expiresIn: JWT_EXPIRE as any };
    return jwt.sign(
        { id },
        JWT_SECRET,
        options
    );
};

const registerUser = async (req: Request, res: Response) => {
    try {
        const { 
            firstName, 
            lastName, 
            username, 
            email, 
            password
        } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email or username already exists." });
        }

        const hashedPassword = await hashPassword(password);
        if (!hashedPassword) {
            return res.status(500).json({ message: "Failed to hash password." });
        }
        const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        });
        if (user) {
            const token = generateToken(user._id.toString());
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.status(201).json({ message: "User registered successfully."});
        }
    } catch (error: any) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Failed to register user." });
    }
};

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email. User not found." });
        }
        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password does not match." });
        }
        const token = generateToken(user._id.toString());
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ message: "User logged in successfully." });
    } catch (error: any) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Failed to log in user." });
    }
};

const logoutUser = async (req: Request, res: Response) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 0
        });
        return res.status(200).json({ message: "User logged out successfully." });
    } catch (error: any) {
        console.error("Error logging out user:", error);
        return res.status(500).json({ message: "Failed to log out user." });
    }
};

export { registerUser, loginUser, logoutUser };