import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS: number = 10;

export async function hashPassword(password: string): Promise<string> {
    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        return hash;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Failed to secure password.");
    }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        console.error("Error verifying password:", error);
        return false;
    }
}