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
exports.movieStateResolvers = void 0;
const movieState_1 = require("./../types/movieState");
const enumType_1 = require("./../enumType");
const typeorm_1 = require("typeorm");
const MovieState_1 = require("./../entity/MovieState");
const auth_1 = require("./../middleware/auth");
const User_1 = require("./../entity/User");
const Movie_1 = require("./../entity/Movie");
const type_graphql_1 = require("type-graphql");
let movieStateResolvers = class movieStateResolvers {
    getCurrentMovieState({ payload }, mid) {
        return __awaiter(this, void 0, void 0, function* () {
            const movieStates = yield typeorm_1.getConnection()
                .createQueryBuilder(MovieState_1.MovieState, 'movieState')
                .where('movieState.userId = :uid', { uid: payload === null || payload === void 0 ? void 0 : payload.id })
                .andWhere('movieState.movieId = :mid', { mid })
                .getOne();
            return {
                watching: movieStates === null || movieStates === void 0 ? void 0 : movieStates.watching,
                completed: movieStates === null || movieStates === void 0 ? void 0 : movieStates.completed,
                planToWatch: movieStates === null || movieStates === void 0 ? void 0 : movieStates.planToWatch,
                drop: movieStates === null || movieStates === void 0 ? void 0 : movieStates.drop,
            };
        });
    }
    getMovieState({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const movieStates = yield typeorm_1.getConnection()
                .createQueryBuilder(MovieState_1.MovieState, 'movieState')
                .where('movieState.userId = :uid', { uid: payload === null || payload === void 0 ? void 0 : payload.id })
                .getMany();
            const movieStateResult = movieStates.reduce((state, item) => {
                const watching = state.watching + item.watching;
                const completed = state.completed + item.completed;
                const planToWatch = state.planToWatch + item.planToWatch;
                const drop = state.drop + item.drop;
                state = { watching, completed, planToWatch, drop };
                return state;
            }, {
                watching: 0,
                completed: 0,
                planToWatch: 0,
                drop: 0,
            });
            return {
                watching: movieStateResult.watching,
                completed: movieStateResult.completed,
                planToWatch: movieStateResult.planToWatch,
                drop: movieStateResult.drop,
            };
        });
    }
    updateMovieState(mid, options, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const movie = yield Movie_1.Movie.findOne({ where: { id: mid } });
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
            try {
                let movieState = yield typeorm_1.getConnection()
                    .createQueryBuilder(MovieState_1.MovieState, 'movieState')
                    .where('movieState.userId = :uid', { uid: payload === null || payload === void 0 ? void 0 : payload.id })
                    .andWhere('movieState.movieId = :mid', { mid })
                    .getOne();
                if (!movieState) {
                    movieState = new MovieState_1.MovieState();
                }
                movieState.watching = 0;
                movieState.planToWatch = 0;
                movieState.completed = 0;
                movieState.drop = 0;
                switch (options) {
                    case enumType_1.MovieStateType.Watching:
                        movieState.watching = 1;
                        break;
                    case enumType_1.MovieStateType.Completed:
                        movieState.completed = 1;
                        break;
                    case enumType_1.MovieStateType.Plantowatch:
                        movieState.planToWatch = 1;
                        break;
                    case enumType_1.MovieStateType.Drop:
                        movieState.drop = 1;
                        break;
                }
                movieState.user = user;
                movieState.movie = movie;
                yield typeorm_1.getConnection().manager.save(movieState);
                return {
                    movie,
                    user,
                };
            }
            catch (err) {
                console.log(err);
                return {
                    errors: [
                        {
                            message: 'Something went wrong',
                        },
                    ],
                };
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => movieState_1.UserMovieStateResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('mid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], movieStateResolvers.prototype, "getCurrentMovieState", null);
__decorate([
    type_graphql_1.Query(() => movieState_1.UserMovieStateResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], movieStateResolvers.prototype, "getMovieState", null);
__decorate([
    type_graphql_1.Mutation(() => movieState_1.MovieStateResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg('mid')),
    __param(1, type_graphql_1.Arg('options')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], movieStateResolvers.prototype, "updateMovieState", null);
movieStateResolvers = __decorate([
    type_graphql_1.Resolver()
], movieStateResolvers);
exports.movieStateResolvers = movieStateResolvers;
//# sourceMappingURL=movieStateResolvers.js.map