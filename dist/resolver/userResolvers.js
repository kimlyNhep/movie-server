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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.userResolvers = void 0;
const graphql_upload_1 = require("graphql-upload");
const enumType_1 = require("./../enumType");
const user_1 = require("./../types/user");
const sendRefreshToken_1 = require("./../sendRefreshToken");
const auth_1 = require("./../middleware/auth");
const token_1 = require("./../token");
const User_1 = require("./../entity/User");
const type_graphql_1 = require("type-graphql");
const bcryptjs_1 = require("bcryptjs");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const fs_1 = require("fs");
let userResolvers = class userResolvers {
    me({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { id: payload === null || payload === void 0 ? void 0 : payload.id } });
            return user;
        });
    }
    register(options, photo) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.hash(options.password, 12);
            try {
                const { createReadStream, filename } = photo;
                createReadStream().pipe(fs_1.createWriteStream(__dirname + `/../../public/profile/${filename}`));
                const user = new User_1.User();
                user.email = options.email;
                user.username = options.username;
                user.role = options.role || enumType_1.UserRoles.Member;
                user.password = hashedPassword;
                user.photo = `http://localhost:8000/profile/${filename}`;
                const errors = yield class_validator_1.validate(user);
                if (errors.length > 0) {
                    return {
                        errors: errors.map((error) => {
                            const { constraints, property } = error;
                            const key = Object.keys(constraints)[0];
                            return { field: property, message: constraints[key] };
                        }),
                    };
                }
                else {
                    yield typeorm_1.getManager().save(user);
                    return {
                        user,
                    };
                }
            }
            catch (err) {
                const { code } = err;
                if (code === '23505') {
                    const start = err.detail.indexOf('(');
                    const end = err.detail.indexOf(')');
                    return {
                        errors: [
                            {
                                field: err.detail.substring(start + 1, end),
                                message: 'Already exist!',
                            },
                        ],
                    };
                }
                return {
                    errors: err,
                };
            }
        });
    }
    login(options, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { username: options.username } });
            if (!user) {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'User not exist',
                        },
                    ],
                };
            }
            const valid = yield bcryptjs_1.compare(options.password, user.password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: 'password',
                            message: 'is Not Correct.',
                        },
                    ],
                };
            }
            sendRefreshToken_1.sendRefreshToken(res, token_1.accessToken(user));
            return {
                accessToken: token_1.accessToken(user),
                user,
            };
        });
    }
    logout({ res }) {
        return new Promise((resolve) => {
            res.clearCookie('token');
            resolve(true);
        });
    }
    createCharacter(options, photo) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.hash(options.password, 12);
            try {
                const { createReadStream, filename } = photo;
                createReadStream().pipe(fs_1.createWriteStream(__dirname + `/../../public/profile/${filename}`));
                const user = new User_1.User();
                user.email = options.email;
                user.username = options.username;
                user.role = options.role || enumType_1.UserRoles.Character;
                user.password = hashedPassword;
                user.photo = `http://localhost:8000/profile/${filename}`;
                const errors = yield class_validator_1.validate(user);
                if (errors.length > 0) {
                    return {
                        errors: errors.map((error) => {
                            const { constraints, property } = error;
                            const key = Object.keys(constraints)[0];
                            return { field: property, message: constraints[key] };
                        }),
                    };
                }
                else {
                    yield typeorm_1.getManager().save(user);
                    return {
                        user,
                    };
                }
            }
            catch (err) {
                const { code } = err;
                if (code === '23505') {
                    const start = err.detail.indexOf('(');
                    const end = err.detail.indexOf(')');
                    return {
                        errors: [
                            {
                                field: err.detail.substring(start + 1, end),
                                message: 'Already exist!',
                            },
                        ],
                    };
                }
                return {
                    errors: err,
                };
            }
        });
    }
    getAllCharacter() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .select('user')
                .from(User_1.User, 'user')
                .where('user.role = :role', { role: enumType_1.UserRoles.Character })
                .getMany();
            if (!users) {
                return {
                    errors: [
                        {
                            message: "User doesn't exist",
                        },
                    ],
                };
            }
            return {
                users: users,
            };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], userResolvers.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => user_1.RegisterResponse),
    __param(0, type_graphql_1.Arg('options')),
    __param(1, type_graphql_1.Arg('photo', () => graphql_upload_1.GraphQLUpload, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.UserRegisterInput, Object]),
    __metadata("design:returntype", Promise)
], userResolvers.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => user_1.LoginResponse),
    __param(0, type_graphql_1.Arg('options')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.UserLoginInput, Object]),
    __metadata("design:returntype", Promise)
], userResolvers.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], userResolvers.prototype, "logout", null);
__decorate([
    type_graphql_1.Mutation(() => user_1.RegisterResponse),
    __param(0, type_graphql_1.Arg('options')),
    __param(1, type_graphql_1.Arg('photo', () => graphql_upload_1.GraphQLUpload)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.UserRegisterInput, Object]),
    __metadata("design:returntype", Promise)
], userResolvers.prototype, "createCharacter", null);
__decorate([
    type_graphql_1.Query(() => user_1.UsersResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], userResolvers.prototype, "getAllCharacter", null);
userResolvers = __decorate([
    type_graphql_1.Resolver()
], userResolvers);
exports.userResolvers = userResolvers;
//# sourceMappingURL=userResolvers.js.map