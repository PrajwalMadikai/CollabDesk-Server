"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(id, fullname, email, password, paymentDetail, workSpaces) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.paymentDetail = paymentDetail;
        this.workSpaces = workSpaces;
    }
}
exports.UserEntity = UserEntity;
