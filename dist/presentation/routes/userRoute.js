"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TokenService_1 = require("../../applications/services/TokenService");
const bcryptService_1 = require("../../applications/services/bcryptService");
const UserUsecase_1 = require("../../applications/usecases/UserUsecase");
const UserRespository_1 = require("../../respository/UserRespository");
const loginController_1 = require("../controllers/loginController");
const router = express_1.default.Router();
const userRepository = new UserRespository_1.UserRepository();
const tokenService = new TokenService_1.TokenService();
const hashService = new bcryptService_1.BcryptService();
const userUsecase = new UserUsecase_1.UserUsecase(userRepository, hashService, tokenService);
const loginController = new loginController_1.LoginController(userUsecase);
router.post('/signup', loginController.registerUser.bind(loginController));
exports.default = router;
