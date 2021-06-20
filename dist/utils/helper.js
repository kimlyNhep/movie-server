"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvHost = exports.getUserLogged = void 0;
const getUserLogged = ({ req }) => {
    const token = req.cookies;
    console.log(token);
};
exports.getUserLogged = getUserLogged;
const getEnvHost = () => {
    if (process.env.NODE_NEV === 'production')
        return process.env.HOST;
    else
        return process.env.HOST_DEV;
};
exports.getEnvHost = getEnvHost;
//# sourceMappingURL=helper.js.map