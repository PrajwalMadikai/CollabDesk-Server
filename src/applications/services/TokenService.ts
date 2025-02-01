import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

export class TokenService {
    
    generateToken(payload: object): string | { status: number; message: string } {
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            return { status: 500, message: "JWT Secret key is missing!" };
        }

        try {
            const token = jwt.sign(payload, secretKey, {
                expiresIn:  "1m",
            });
            return token;
        } catch (error: any) {
            console.error("Error generating access token:", error.message);
            return { status: 500, message: "Failed to generate access token" };
        }
    }

    generateRefreshToken(payload: object): string | { status: number; message: string } {
        const secretKey = process.env.REFRESH_TOKEN_SECRET;
        if (!secretKey) {
            return { status: 500, message: "Refresh Token secret key is missing!" };
        }

        try {
            const token = jwt.sign(payload, secretKey, {
                expiresIn:  "7d",
            });
            return token;
        } catch (error: any) {
            console.error("Error generating refresh token:", error.message);
            return { status: 500, message: "Failed to generate refresh token" };
        }
    }

    verifyToken(token: string): JwtPayload | { status: number; message: string } {
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            return { status: 500, message: "JWT Secret key is missing for verification!" };
        }

        try {
            const decoded = jwt.verify(token, secretKey);
            return decoded as JwtPayload;
        } catch (error: any) {
            console.error("Error verifying access token:", error.message);
            return { status: 401, message: "Invalid or expired access token" };
        }
    }

    verifyRefreshToken(token: string): JwtPayload | { status: number; message: string } {
        const secretKey = process.env.REFRESH_TOKEN_SECRET;
        if (!secretKey) {
            return { status: 500, message: "Refresh Token secret key is missing for verification!" };
        }

        try {
            const decoded = jwt.verify(token, secretKey);
            return decoded as JwtPayload;
        } catch (error: any) {
            console.error("Error verifying refresh token:", error.message);
            return { status: 401, message: "Invalid or expired refresh token" };
        }
    }
}
