import { NextFunction, Request, Response } from "express";
import { TokenService } from "../../applications/services/TokenService";
const tokenService = new TokenService();  

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];  
  if (!token) {
    res.status(401).json({ message: "Access Denied: No Token Provided" });
    return;
  }

  const verified =tokenService.verifyToken(token);

  if ("status" in verified) {
    res.status(verified.status).json({ message: verified.message });
    return;
  }

  req.user = verified;  
  next();  
};
