import { NextFunction, Request, Response } from "express";
import { TokenPayload, TokenService } from "../../applications/services/TokenService";
import { UserRole } from "../../interface/roles";
const tokenService = new TokenService();  

 


interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
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


export const authorizeRoles = (...roles: UserRole[]) => {
  return async(req: AuthenticatedRequest, res: Response, next: NextFunction):Promise<void> => {
    if (!req.user) {
       res.status(401).json({ message: 'Authentication required' });
       return
    }

    const userrole=req.user.role as UserRole

    if (!roles.includes(userrole)) {
       res.status(403).json({ 
        message: 'You do not have permission to access this resource' 
      });
      return
    }

    next();
  };
};