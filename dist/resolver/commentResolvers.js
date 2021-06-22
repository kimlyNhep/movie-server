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
exports.commentResolvers = void 0;
const movie_1 = require("./../types/movie");
const error_1 = require("./../types/error");
const auth_1 = require("./../middleware/auth");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const Comment_1 = require("../entity/Comment");
const Movie_1 = require("../entity/Movie");
let CommentMovieInput = class CommentMovieInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CommentMovieInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CommentMovieInput.prototype, "comments", void 0);
CommentMovieInput = __decorate([
    type_graphql_1.InputType()
], CommentMovieInput);
let CommentResponse = class CommentResponse {
};
__decorate([
    type_graphql_1.Field(() => Comment_1.Comment, { nullable: true }),
    __metadata("design:type", Comment_1.Comment)
], CommentResponse.prototype, "comment", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], CommentResponse.prototype, "errors", void 0);
CommentResponse = __decorate([
    type_graphql_1.ObjectType()
], CommentResponse);
let CommentsResponse = class CommentsResponse {
};
__decorate([
    type_graphql_1.Field(() => [CommentWithPermission], { nullable: true }),
    __metadata("design:type", Array)
], CommentsResponse.prototype, "comments", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], CommentsResponse.prototype, "errors", void 0);
CommentsResponse = __decorate([
    type_graphql_1.ObjectType()
], CommentsResponse);
let CommentWithPermission = class CommentWithPermission {
};
__decorate([
    type_graphql_1.Field(() => Comment_1.Comment, { nullable: true }),
    __metadata("design:type", Comment_1.Comment)
], CommentWithPermission.prototype, "comment", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], CommentWithPermission.prototype, "isEdit", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], CommentWithPermission.prototype, "isDelete", void 0);
CommentWithPermission = __decorate([
    type_graphql_1.ObjectType()
], CommentWithPermission);
let commentResolvers = class commentResolvers {
    getComments(mid, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield typeorm_1.getConnection()
                .getRepository(Comment_1.Comment)
                .createQueryBuilder('comment')
                .innerJoinAndSelect('comment.user', 'user')
                .where('comment.movieId = :mid', { mid })
                .orderBy('comment.createdAt', 'ASC')
                .getMany();
            const results = comments.map((comment) => {
                if (comment.user.id === (payload === null || payload === void 0 ? void 0 : payload.id)) {
                    return { comment: comment, isEdit: true, isDelete: true };
                }
                return { comment: comment, isEdit: false, isDelete: false };
            });
            return {
                comments: results,
            };
        });
    }
    getComment({ payload }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield typeorm_1.getConnection()
                .getRepository(Comment_1.Comment)
                .createQueryBuilder('comment')
                .innerJoinAndSelect('comment.user', 'user')
                .where('comment.id = :id', { id })
                .getOne();
            if (!comment) {
                return {
                    errors: [
                        {
                            message: "Comment doesn't exist",
                        },
                    ],
                };
            }
            else {
                const user = yield User_1.User.findOne({ where: { id: payload === null || payload === void 0 ? void 0 : payload.id } });
                if (comment.user.id !== (user === null || user === void 0 ? void 0 : user.id)) {
                    return {
                        errors: [
                            {
                                field: 'User',
                                message: 'Permission deny',
                            },
                        ],
                    };
                }
            }
            return {
                comment,
            };
        });
    }
    updateComment({ payload }, id, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield typeorm_1.getConnection()
                .getRepository(Comment_1.Comment)
                .createQueryBuilder('comment')
                .innerJoinAndSelect('comment.user', 'user')
                .where('comment.id = :id', { id })
                .getOne();
            if (!comment) {
                return {
                    errors: [
                        {
                            message: "User doesn't exist",
                        },
                    ],
                };
            }
            else {
                const user = yield User_1.User.findOne({ where: { id: payload === null || payload === void 0 ? void 0 : payload.id } });
                if (!user) {
                    return {
                        errors: [
                            {
                                field: 'id',
                                message: 'Logged user is not exist',
                            },
                        ],
                    };
                }
                else {
                    if (user.id !== comment.user.id)
                        return {
                            errors: [
                                {
                                    field: 'user',
                                    message: 'You cannot modify other reviews',
                                },
                            ],
                        };
                }
                yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .update(Comment_1.Comment)
                    .set({ text })
                    .where('comment.id = :id', { id })
                    .execute();
                return {
                    comment,
                };
            }
        });
    }
    deleteComment({ payload }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield typeorm_1.getConnection()
                .getRepository(Comment_1.Comment)
                .createQueryBuilder('comment')
                .innerJoinAndSelect('comment.user', 'user')
                .where('comment.id = :id', { id })
                .getOne();
            if (!comment) {
                return {
                    errors: [
                        {
                            message: "User doesn't exist",
                        },
                    ],
                };
            }
            else {
                const user = yield User_1.User.findOne({ where: { id: payload === null || payload === void 0 ? void 0 : payload.id } });
                if (!user) {
                    return {
                        errors: [
                            {
                                field: 'id',
                                message: 'Logged user is not exist',
                            },
                        ],
                    };
                }
                else {
                    if (user.id !== comment.user.id)
                        return {
                            errors: [
                                {
                                    field: 'user',
                                    message: 'You cannot delete other reviews',
                                },
                            ],
                        };
                }
                yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .delete()
                    .from(Comment_1.Comment)
                    .where('comment.id = :id', { id })
                    .execute();
                return {
                    comment,
                };
            }
        });
    }
    commentMovies({ payload }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const movie = yield Movie_1.Movie.findOne({ where: { id: options.id } });
            if (!movie) {
                return {
                    errors: [
                        {
                            message: "Movie doesn't exist",
                        },
                    ],
                };
            }
            const user = yield User_1.User.findOne({ where: { id: payload === null || payload === void 0 ? void 0 : payload.id } });
            if (!user) {
                return {
                    errors: [
                        {
                            message: "User doesn't exist",
                        },
                    ],
                };
            }
            const commentMovie = new Comment_1.Comment();
            commentMovie.user = user;
            commentMovie.movie = movie;
            commentMovie.text = options.comments;
            yield typeorm_1.getConnection().manager.save(commentMovie);
            return {
                movie,
            };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => CommentsResponse),
    type_graphql_1.UseMiddleware(auth_1.isLogged),
    __param(0, type_graphql_1.Arg('movieId')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], commentResolvers.prototype, "getComments", null);
__decorate([
    type_graphql_1.Query(() => CommentResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], commentResolvers.prototype, "getComment", null);
__decorate([
    type_graphql_1.Mutation(() => CommentResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('id')),
    __param(2, type_graphql_1.Arg('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], commentResolvers.prototype, "updateComment", null);
__decorate([
    type_graphql_1.Mutation(() => CommentResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], commentResolvers.prototype, "deleteComment", null);
__decorate([
    type_graphql_1.Mutation(() => movie_1.MovieResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CommentMovieInput]),
    __metadata("design:returntype", Promise)
], commentResolvers.prototype, "commentMovies", null);
commentResolvers = __decorate([
    type_graphql_1.Resolver()
], commentResolvers);
exports.commentResolvers = commentResolvers;
//# sourceMappingURL=commentResolvers.js.map