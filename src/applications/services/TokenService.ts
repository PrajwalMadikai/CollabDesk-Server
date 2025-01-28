import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export class TokenService {

    generateToken(payload: object): string | { status: number, message: string }  {
        const secretKey = process.env.JWT_SECRET ;
        if (!secretKey) {
            return { status: 404, message: 'No Secret key!' }; 
        }
        return jwt.sign(payload, secretKey, { expiresIn: "1h" });
    }
    generateRefreshToken(payload: object): string | { status: number, message: string } {
        const secretKey = process.env.JWT_REFRESH_SECRET;
        if (!secretKey) {
            return { status: 404, message: 'No Secret key in refresh token creation!' };
        }
        return jwt.sign(payload, secretKey, { expiresIn: "7d" });
    }

    verifyToken(token: string,res:Response): JwtPayload | null|{ status: number, message: string }  {
        try {
            const secretKey = process.env.JWT_SECRET;
            if (!secretKey) {
                return { status: 404, message: 'No Secret key in Verify Access Token!' };
            }

            const decoded = jwt.verify(token, secretKey);

        
            if (typeof decoded === "object" && decoded !== null) {
                return decoded as JwtPayload;  
            }
            return null;  
        } catch (error:any) {
            console.error("Error verifying token:", error.message);
            return res.status(401).json({ message: "Token expired or invalid" });
        }
    }
        // Verify Refresh Token
        verifyRefreshToken(token: string): JwtPayload | null | { status: number, message: string } {
            try {
                const secretKey = process.env.JWT_REFRESH_SECRET;
                if (!secretKey) {
                    return { status: 404, message: 'No Secret key in Verify Refresh Token!' };
                }

                const decoded = jwt.verify(token, secretKey);
                if (typeof decoded === "object" && decoded !== null) {
                    return decoded as JwtPayload;
                }
                return null;
            } catch (error: any) {
                console.error("Error verifying refresh token:", error.message);
                return null;
            }
        }
    
}
