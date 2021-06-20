"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieStateType = exports.StatusType = exports.MovieType = exports.UserRoles = void 0;
var UserRoles;
(function (UserRoles) {
    UserRoles["Admin"] = "Admin";
    UserRoles["Member"] = "Member";
})(UserRoles = exports.UserRoles || (exports.UserRoles = {}));
var MovieType;
(function (MovieType) {
    MovieType["Tv"] = "Tv";
    MovieType["Movie"] = "Movie";
})(MovieType = exports.MovieType || (exports.MovieType = {}));
var StatusType;
(function (StatusType) {
    StatusType["Completed"] = "Completed";
    StatusType["Ongoing"] = "Ongoing";
})(StatusType = exports.StatusType || (exports.StatusType = {}));
var MovieStateType;
(function (MovieStateType) {
    MovieStateType["Watching"] = "Watching";
    MovieStateType["Plantowatch"] = "Plantowatch";
    MovieStateType["Completed"] = "Completed";
    MovieStateType["Drop"] = "Drop";
})(MovieStateType = exports.MovieStateType || (exports.MovieStateType = {}));
//# sourceMappingURL=enumType.js.map