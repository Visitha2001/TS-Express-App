// auth.middleware.ts
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "@/models/User";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
    user?: {
        _id: string;
        firstName: string;
        lastName: string;
        username: string;
        email: string;
    };
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token." });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found." });
        }
        req.user = {
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
        };
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({ message: "Not authorized, token failed." });
    }
};

export { protect };