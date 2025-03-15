import { NextFunction, Request, Response } from "express";
import { GithubUsecase } from "../../applications/usecases/GithubUsecase";
import { GoogleAuthUsecase } from "../../applications/usecases/GoogleUsecase";
import { UserUsecase } from "../../applications/usecases/UserUsecase";
import { USERMESSAGES } from "../messages/userMessages";

export class LoginController {
  constructor(
    private userUsecase: UserUsecase,
    private googleUseCase: GoogleAuthUsecase,
    private githubUsecase: GithubUsecase
  ) {}

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName, workSpaces, paymentDetail, isAdmin } = req.body;
      const result = await this.userUsecase.registerUser(
        email,
        password,
        fullName,
        workSpaces,
        paymentDetail,
        isAdmin
      );
      res.status(201).json({ message: USERMESSAGES.SUCCESS.TEMP_USER, result });
    } catch (error: any) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, token } = req.body;
      if (!email || !token) {
        return res.status(400).json({ message: USERMESSAGES.ERROR.MISSING_EMAIL_OR_TOKEN });
      }
      const result = await this.userUsecase.verifyEmail(email as string, token as string);
      res.status(200).json({ message: USERMESSAGES.SUCCESS.EMAIL_VERIFICATION, result });
    } catch (error: any) {
      next(error);
    }
  }

  async googleSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ message: USERMESSAGES.ERROR.INVALID_CREDENTIALS });
      }
      const result = await this.googleUseCase.execute(idToken);
      if (result.status === 404) {
        return res.status(404).json({ message: USERMESSAGES.ERROR.ACCOUNT_ALREADY_EXISTS });
      }
      const { user, googleUser } = result;
      const responseUser = user || googleUser;
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      });
      return res.status(201).json({
        message: USERMESSAGES.SUCCESS.GOOGLE_SIGNUP,
        user: responseUser,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ message: USERMESSAGES.ERROR.INVALID_CREDENTIALS });
      }
      const result = await this.googleUseCase.executeLogin(idToken);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message });
      }
      const { user, accessToken, refreshToken, message } = result;
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      });
      return res.status(200).json({
        message: USERMESSAGES.SUCCESS.GOOGLE_AUTH,
        user,
        accessToken,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async gitHubAuth(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.query.code) {
        const state = req.query.state ? JSON.parse(decodeURIComponent(req.query.state as string)) : {};
        const mode = state.mode || "login";
        const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
        const redirectUri = `${process.env.CLIENT_URL}/auth/github/callback`;
        const stateParam = encodeURIComponent(JSON.stringify({ mode }));
        return res.redirect(
          `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email&state=${stateParam}`
        );
      }
      const { code, state } = req.query;
      const { mode } = JSON.parse(decodeURIComponent(state as string));
      if (typeof code !== "string") {
        return res.status(400).json({ error: USERMESSAGES.ERROR.INVALID_CODE_FORMAT });
      }
      try {
        const { user, isRegistered, accessToken, refreshToken } = await this.githubUsecase.handleGithubAuth(code, mode);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });
        return res.redirect(
          `${process.env.CLIENT_URL}/auth/github/callback?data=${encodeURIComponent(
            JSON.stringify({ ...user, isRegistered, accessToken })
          )}&mode=${mode}`
        );
      } catch (error: any) {
        return res.redirect(
          `${process.env.CLIENT_URL}/auth/github/callback?error=${encodeURIComponent(error.message)}&mode=${mode}`
        );
      }
    } catch (error: any) {
      next(error);
    }
  }

  async LoginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).json({ message: USERMESSAGES.ERROR.MISSING_EMAIL_OR_TOKEN });
      }
      if (!password) {
        return res.status(400).json({ message: USERMESSAGES.ERROR.INVALID_CREDENTIALS });
      }
      const result = await this.userUsecase.findUser(email, password);
      if (!result.user) {
        return res.status(404).json({ message: USERMESSAGES.ERROR.USER_NOT_FOUND });
      }
      if (result.status !== 200) {
        return res.status(result.status).json({ message: result.message });
      }
      if (result.refreshToken) {
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });
      }
      return res.status(200).json({
        message: USERMESSAGES.SUCCESS.LOGIN_SUCCESS,
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async requestAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      let refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(403).json({ message: USERMESSAGES.ERROR.REFRESH_TOKEN_REQUIRED });
      }
      const result = await this.userUsecase.makeNewAccessToken(refreshToken);
      if (result.status !== 200) {
        return res.status(result.status).json({ message: USERMESSAGES.ERROR.ERROR_ACCESSTOKEN_CREATION });
      }
      return res.status(200).json({
        message: USERMESSAGES.SUCCESS.ACCESSTOKE_CREATION,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      console.error("Error during new access token creation:", error);
      next(error);
    }
  }

  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res.status(200).json({ message: USERMESSAGES.SUCCESS.LOGOUT_SUCCESS });
    } catch (error: any) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!password) {
        return res.status(400).json({ message: USERMESSAGES.ERROR.INVALID_CREDENTIALS });
      }
      const newPassword = await this.userUsecase.resetPassword(email, password);
      if (!newPassword) {
        return res.status(404).json({ message: USERMESSAGES.INFO.NO_USERS_FOUND });
      }
      return res.status(200).json({ message: USERMESSAGES.SUCCESS.PASSWORD_UPDATED });
    } catch (error: any) {
      next(error);
    }
  }

  async sendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const userExists = await this.userUsecase.isExists(email);
      if (!userExists) {
        return res.status(404).json({ message: USERMESSAGES.ERROR.USER_NOT_FOUND });
      }
      const emailCheck = await this.userUsecase.sendEmail(email);
      if (!emailCheck) {
        return res.status(404).json({ message: USERMESSAGES.ERROR.EMAIL_VERIFICATION_FAILED });
      }
      return res.status(200).json({ message: USERMESSAGES.SUCCESS.EMAIL_SENT });
    } catch (error: any) {
      next(error);
    }
  }

  async verifyemailResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, token } = req.body;
      if (!email || !token) {
        throw new Error(USERMESSAGES.ERROR.MISSING_EMAIL_OR_TOKEN);
      }
      const result = await this.userUsecase.findResetUser(email, token);
      if (!result) {
        return res.status(404).json({ message: USERMESSAGES.ERROR.RESET_USER_NOT_FOUND });
      }
      return res.status(200).json({ message: USERMESSAGES.SUCCESS.EMAIL_VERIFICATION, userEmail: email });
    } catch (error: any) {
      next(error);
    }
  }

  async verifyUserLiveblocks(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: USERMESSAGES.ERROR.UNAUTHORIZED });
      }
      let user = await this.userUsecase.verifyUser(token);
      if (!user) {
        return res.status(404).json({ message: USERMESSAGES.ERROR.USER_NOT_FOUND });
      }
      return res.status(200).json({
        id: user.id?.toString(),
        name: user.fullname,
        email: user.email,
        profileImage: user.avatar,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async fetchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      let user = await this.userUsecase.fetch();
      if (!user) {
        return res.status(404).json({ message: USERMESSAGES.ERROR.UNABLE_TO_FETCH_USER_DATA });
      }
      return res.status(200).json({ message: USERMESSAGES.SUCCESS.USER_FETCHED, user });
    } catch (error: any) {
      next(error);
    }
  }

  async renameUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, newName } = req.body;
      if (!userId || !newName) {
        return res.status(400).json({ message: USERMESSAGES.ERROR.MISSING_FIELDS });
      }
      const user = await this.userUsecase.updateUsername(userId, newName);
      if (!user) {
        return res.status(404).json({ message: USERMESSAGES.ERROR.UNABLE_TO_UPDATE_USERNAME });
      }
      return res.status(200).json({ message: USERMESSAGES.SUCCESS.USERNAME_UPDATED, user });
    } catch (error: any) {
      next(error);
    }
  }

  async getPaymentPlans(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await this.userUsecase.getPlans();
      if (!data) {
        return res.status(404).json({ message: USERMESSAGES.INFO.NO_PLANS_AVAILABLE });
      }
      return res.status(200).json({ message: USERMESSAGES.SUCCESS.PAYMENT_PLANS, data });
    } catch (error: any) {
      next(error);
    }
  }
}