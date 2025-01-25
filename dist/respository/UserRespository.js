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
exports.UserRepository = void 0;
const userModal_1 = require("../database/models/userModal");
const userEntity_1 = require("../entities/userEntity");
class UserRepository {
    createUser(email, password, fullname, workSpaces, paymentDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldUser = yield userModal_1.UserModal.findOne({ email });
            if (oldUser) {
                console.log('already exists');
                return { error: "Email already exists!." };
            }
            const user = yield userModal_1.UserModal.create({
                fullname,
                email,
                password,
                workSpaces,
                paymentDetail,
            });
            return new userEntity_1.UserEntity(user.id, user.fullname, user.email, user.password, user.paymentDetail, user.workspace);
        });
    }
}
exports.UserRepository = UserRepository;
