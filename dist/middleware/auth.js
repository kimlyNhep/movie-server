"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMember = exports.isAdmin = exports.isAuth = void 0;
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
const isAdmin = async ({ context }, next) => {
    const { token } = context.req.cookies;
    const { id } = jsonwebtoken_1.decode(token);
    const user = await User_1.User.findOne({ where: { id } });
    if ((user === null || user === void 0 ? void 0 : user.role) !== enumType_1.UserRoles.Admin)
        throw new Error('You do not have a permission');
    else
        return next();
};
exports.isAdmin = isAdmin;
const isMember = async ({ context }, next) => {
    const { token } = context.req.cookies;
    const { id } = jsonwebtoken_1.decode(token);
    const user = await User_1.User.findOne({ where: { id } });
    if ((user === null || user === void 0 ? void 0 : user.role) !== enumType_1.UserRoles.Member)
        throw new Error('You do not have a permission');
    else
        return next();
};
exports.isMember = isMember;
//# sourceMappingURL=auth.js.map