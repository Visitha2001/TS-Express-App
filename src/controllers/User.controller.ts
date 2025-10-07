import User from "@/models/User";
import { Request, Response } from "express";

interface AuthRequest extends Request {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        username: string;
        email: string;
    };
}

const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getProfile };