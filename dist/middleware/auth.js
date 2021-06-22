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
exports.isMember = exports.isAdmin = exports.isLogged = exports.isAuth = void 0;
const enumType_1 = require("../enumType");
const User_1 = require("../entity/User");
const jsonwebtoken_1 = require("jsonwebtoken");
const isAuth = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];
    if (!authorization)
        throw new Error('Not Authenticated');
    try {
        const token = authorization.split(' ')[1];
        const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        context.payload = payload;
    }
    catch (_a) {
        throw new Error('Not Authenticated');
    }
    return next();
};
exports.isAuth = isAuth;
const isLogged = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];
    try {
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        if (token) {
            const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
            context.payload = payload;
        }
    }
    catch (_a) {
        context.payload = undefined;
    }
    return next();
};
exports.isLogged = isLogged;
const isAdmin = ({ context }, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = context.req.headers['authorization'];
    if (!authorization)
        throw new Error('Not Authenticated');
    try {
        const token = authorization.split(' ')[1];
        const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        context.payload = payload;
        const user = yield User_1.User.findOne({ where: { id: payload === null || payload === void 0 ? void 0 : payload.id } });
        if ((user === null || user === void 0 ? void 0 : user.role) !== enumType_1.UserRoles.Admin)
            throw new Error('You do not have a permission');
        else
            return next();
    }
    catch (_a) {
        throw new Error('Not Authenticated');
    }
    return next();
});
exports.isAdmin = isAdmin;
const isMember = ({ context }, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = context.req.cookies;
    const { id } = jsonwebtoken_1.decode(token);
    const user = yield User_1.User.findOne({ where: { id } });
    if ((user === null || user === void 0 ? void 0 : user.role) !== enumType_1.UserRoles.Member)
        throw new Error('You do not have a permission');
    else
        return next();
});
exports.isMember = isMember;
//# sourceMappingURL=auth.js.map