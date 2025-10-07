import express from "express";
import { RequestHandler } from "express"
import {
    getProfile
} from "@/controllers/User.controller";
import { protect } from "@/middleware/authMiddleware";

const router = express.Router();

router.get("/profile", protect, getProfile as unknown as RequestHandler);

export default router;