import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        maxlength: [50, "First name cannot exceed 50 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        maxlength: [50, "Last name cannot exceed 50 characters"]
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [50, "Username cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [100, "Email cannot exceed 50 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    }
});

export default mongoose.model("User", userSchema);