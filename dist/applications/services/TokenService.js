"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    generateToken(payload) {
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }
        return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: "1h" });
    }
    verifyToken(token) {
        try {
            const secretKey = process.env.JWT_SECRET;
            if (!secretKey) {
                throw new Error("JWT_SECRET is not defined in environment variables.");
            }
            const decoded = jsonwebtoken_1.default.verify(token, secretKey);
            if (typeof decoded === "object" && decoded !== null) {
                return decoded;
            }
            return null;
        }
        catch (error) {
            console.error("Error verifying token:", error.message);
            return null;
        }
    }
}
exports.TokenService = TokenService;
