"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUsecase = void 0;
class UserUsecase {
    constructor(userRepository, bcryptService, tokenService) {
        this.userRepository = userRepository;
        this.bcryptService = bcryptService;
        this.tokenService = tokenService;
    }
    registerUser(email, password, fullname, workSpaces, paymentDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield this.bcryptService.hashPassword(password);
            const user = yield this.userRepository.createUser(email, hashedPassword, fullname, workSpaces, paymentDetail);
            if ('error' in user) {
                throw new Error(user.error);
            }
            const token = yield this.tokenService.generateToken({ userId: user.id, userEmail: user.email });
            return { user, token };
        });
    }
}
exports.UserUsecase = UserUsecase;
