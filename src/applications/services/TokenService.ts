import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../interface/roles";
dotenv.config();

type TokenResponse = string | TokenError;
type TokenError = { status: number; message: string };

export interface TokenPayload extends JwtPayload {
    userId: string;
    userEmail: string;
    role?: UserRole| string;
}

export class TokenService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;

    constructor() {
        const accessSecret = process.env.JWT_SECRET;
        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

        if (!accessSecret || !refreshSecret) {
            throw new Error("JWT secrets not configured properly");
        }

        this.accessTokenSecret = accessSecret;
        this.refreshTokenSecret = refreshSecret;
    }

    generateToken(payload: Partial<TokenPayload>): TokenResponse {
        try {
            return jwt.sign(payload, this.accessTokenSecret, {
                expiresIn: "1h",
            });
        } catch (error) {
            console.error("Error generating access token:", error instanceof Error ? error.message : "Unknown error");
            return { status: 500, message: "Failed to generate access token" };
        }
    }

    generateRefreshToken(payload: Partial<TokenPayload>): TokenResponse {
        try {
            return jwt.sign(payload, this.refreshTokenSecret, {
                expiresIn: "30d",
            });
        } catch (error) {
            console.error("Error generating refresh token:", error instanceof Error ? error.message : "Unknown error");
            return { status: 500, message: "Failed to generate refresh token" };
        }
    }

    verifyToken(token: string): TokenPayload | TokenError {
        try {
            const decoded = jwt.verify(token, this.accessTokenSecret) as TokenPayload;
            
            if (!decoded.id || !decoded.email || !decoded.role) {
                return { status: 401, message: "Invalid token structure" };
            }

            return decoded;
        } catch (error) {
            console.error("Error verifying access token:", error instanceof Error ? error.message : "Unknown error");
            return { status: 401, message: "Invalid or expired access token" };
        }
    }

    verifyRefreshToken(token: string): TokenPayload | TokenError {
        try {
            const decoded = jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
            
            if (!decoded.id || !decoded.email || !decoded.role) {
                return { status: 401, message: "Invalid token structure" };
            }

            return decoded;
        } catch (error) {
            console.error("Error verifying refresh token:", error instanceof Error ? error.message : "Unknown error");
            return { status: 401, message: "Invalid or expired refresh token" };
        }
    }

    
}