"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleEnum = exports.UserStatusEnum = exports.UserEnum = void 0;
var UserEnum;
(function (UserEnum) {
    UserEnum["ADMIN"] = "admin";
    UserEnum["USER"] = "user";
})(UserEnum || (exports.UserEnum = UserEnum = {}));
var UserStatusEnum;
(function (UserStatusEnum) {
    UserStatusEnum["PENDING"] = "pending";
    UserStatusEnum["ACTIVE"] = "active";
    UserStatusEnum["BANNED"] = "banned";
})(UserStatusEnum || (exports.UserStatusEnum = UserStatusEnum = {}));
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["ADMIN"] = "admin";
    UserRoleEnum["USER"] = "user";
})(UserRoleEnum || (exports.UserRoleEnum = UserRoleEnum = {}));
