"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterResponse = exports.UserLoginInput = exports.UserRegisterInput = exports.UsersResponse = exports.LoginResponse = void 0;
const enumType_1 = require("./../enumType");
const User_1 = require("./../entity/User");
const type_graphql_1 = require("type-graphql");
const error_1 = require("./error");
type_graphql_1.registerEnumType(enumType_1.UserRoles, {
    name: 'UserRoles',
});
let LoginResponse = class LoginResponse {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], LoginResponse.prototype, "accessToken", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], LoginResponse.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], LoginResponse.prototype, "errors", void 0);
LoginResponse = __decorate([
    type_graphql_1.ObjectType()
], LoginResponse);
exports.LoginResponse = LoginResponse;
let UsersResponse = class UsersResponse {
};
__decorate([
    type_graphql_1.Field(() => [User_1.User], { nullable: true }),
    __metadata("design:type", Array)
], UsersResponse.prototype, "users", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], UsersResponse.prototype, "errors", void 0);
UsersResponse = __decorate([
    type_graphql_1.ObjectType()
], UsersResponse);
exports.UsersResponse = UsersResponse;
let UserRegisterInput = class UserRegisterInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserRegisterInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserRegisterInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => enumType_1.UserRoles, { nullable: true }),
    __metadata("design:type", String)
], UserRegisterInput.prototype, "role", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserRegisterInput.prototype, "password", void 0);
UserRegisterInput = __decorate([
    type_graphql_1.InputType()
], UserRegisterInput);
exports.UserRegisterInput = UserRegisterInput;
let UserLoginInput = class UserLoginInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserLoginInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserLoginInput.prototype, "password", void 0);
UserLoginInput = __decorate([
    type_graphql_1.InputType()
], UserLoginInput);
exports.UserLoginInput = UserLoginInput;
let RegisterResponse = class RegisterResponse {
};
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], RegisterResponse.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], RegisterResponse.prototype, "errors", void 0);
RegisterResponse = __decorate([
    type_graphql_1.ObjectType()
], RegisterResponse);
exports.RegisterResponse = RegisterResponse;
//# sourceMappingURL=user.js.map