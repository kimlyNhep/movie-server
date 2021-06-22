"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.accessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const accessToken = (user) => {
    return jsonwebtoken_1.sign({
        id: user.id,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '7d',
    });
};
exports.accessToken = accessToken;
const refreshToken = (user) => {
    return jsonwebtoken_1.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=token.js.map