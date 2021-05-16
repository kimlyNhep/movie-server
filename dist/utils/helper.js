"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLogged = void 0;
const getUserLogged = ({ req }) => {
    const token = req.cookies;
    console.log(token);
};
exports.getUserLogged = getUserLogged;
//# sourceMappingURL=helper.js.map