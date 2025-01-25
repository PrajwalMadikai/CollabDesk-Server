import jwt, { JwtPayload } from "jsonwebtoken";

export class TokenService {

    generateToken(payload: object): string {
        const secretKey = process.env.JWT_SECRET ;
        if (!secretKey) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }
        return jwt.sign(payload, secretKey, { expiresIn: "1h" });
    }

verifyToken(token: string): JwtPayload | null {
    try {
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }

        const decoded = jwt.verify(token, secretKey);

       
        if (typeof decoded === "object" && decoded !== null) {
            return decoded as JwtPayload;  
        }
        return null;  
    } catch (error:any) {
        console.error("Error verifying token:", error.message);
        return null; 
    }
}

    
}
