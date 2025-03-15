import { NextFunction, Request, Response } from "express-serve-static-core";
import { AdminUsecase } from "../../applications/usecases/AdminUsecase";
import { ADMIN_MESSAGES } from "../messages/adminMessages";
export class AdminController {
  constructor(private adminUsecase: AdminUsecase) {}

  async findAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const admin = await this.adminUsecase.verfyAdmin(email, password);

      if (admin.refreshToken) {
        res.cookie("adminRefreshToken", admin.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });

        return res.status(200).json({
          message: ADMIN_MESSAGES.SUCCESS.LOGIN_SUCCESS,
          admin: admin.admin,
          accessToken: admin.accessToken,
        });
      }

      return res.status(401).json({ message: ADMIN_MESSAGES.ERROR.AUTHENTICATION_FAILED });
    } catch (error) {
      next(error);
    }
  }

  async logoutAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("adminRefreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({ message: ADMIN_MESSAGES.SUCCESS.LOGOUT_SUCCESS });
      return;
    } catch (error) {
      next(error);
      console.log(error);
      res.status(500).json({ message: ADMIN_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
      return;
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      let users = await this.adminUsecase.findAllUsers();

      if (!users) {
        return res.status(404).json({ message: ADMIN_MESSAGES.ERROR.FETCH_USERS_FAILED });
      }

      return res.status(200).json(users);
    } catch (error) {
      next(error);
      console.log(error);
      return res.status(500).json({ message: ADMIN_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      let user = await this.adminUsecase.block(userId);

      if (!user) {
        return res.status(404).json({ message: ADMIN_MESSAGES.ERROR.USER_NOT_FOUND });
      }

      return res.status(200).json(user);
    } catch (error) {
      next(error);
      console.log(error);
      return res.status(500).json({ message: ADMIN_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
    }
  }

  async unBlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      let user = await this.adminUsecase.unBlock(userId);

      if (!user) {
        return res.status(404).json({ message: ADMIN_MESSAGES.ERROR.USER_NOT_FOUND });
      }

      return res.status(200).json(user);
    } catch (error) {
      next(error);
      console.log(error);
      return res.status(500).json({ message: ADMIN_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
    }
  }

  async adminRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.adminRefreshToken;

      if (!refreshToken) {
        return res.status(403).json({ message: ADMIN_MESSAGES.ERROR.REFRESH_TOKEN_REQUIRED });
      }

      const newAccessToken = await this.adminUsecase.makeAdminrefreshToken(refreshToken);

      if (!newAccessToken) {
        return res.status(403).json({ message: ADMIN_MESSAGES.ERROR.INVALID_REFRESH_TOKEN });
      }

      return res.status(200).json({
        message: ADMIN_MESSAGES.SUCCESS.NEW_ACCESS_TOKEN,
        accessToken: newAccessToken,
      });
    } catch (error) {
      next(error);
      console.log(error);
      return res.status(500).json({ message: ADMIN_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
    }
  }
}