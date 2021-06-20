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
exports.ratingResolvers = exports.RatingInput = void 0;
const Movie_1 = require("../entity/Movie");
const typeorm_1 = require("typeorm");
const RatingMovies_1 = require("../entity/RatingMovies");
const User_1 = require("../entity/User");
const auth_1 = require("../middleware/auth");
const movie_1 = require("../types/movie");
const type_graphql_1 = require("type-graphql");
let RatingInput = class RatingInput {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], RatingInput.prototype, "ratedPoint", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RatingInput.prototype, "movieId", void 0);
RatingInput = __decorate([
    type_graphql_1.InputType()
], RatingInput);
exports.RatingInput = RatingInput;
let ratingResolvers = class ratingResolvers {
    ratingMovie({ payload }, option) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { id: payload === null || payload === void 0 ? void 0 : payload.id } });
            if (!user) {
                return {
                    errors: [
                        {
                            message: 'User not exist',
                        },
                    ],
                };
            }
            const movie = yield Movie_1.Movie.findOne({ where: { id: option.movieId } });
            if (!movie) {
                return {
                    errors: [
                        {
                            message: "Movie doesn't exist",
                        },
                    ],
                };
            }
            let existingRatingMovie = yield typeorm_1.getConnection()
                .createQueryBuilder(RatingMovies_1.RatingMovies, 'ratingMovie')
                .where('ratingMovie.userId = :uid', { uid: user.id })
                .andWhere('ratingMovie.movieId = :mid', { mid: movie.id })
                .getOne();
            const queryRunner = typeorm_1.getConnection().createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const newMovie = queryRunner.manager.create(Movie_1.Movie, movie);
                if (!existingRatingMovie) {
                    existingRatingMovie = new RatingMovies_1.RatingMovies();
                }
                existingRatingMovie.movie = movie;
                existingRatingMovie.user = user;
                existingRatingMovie.ratedPoint = option.ratedPoint;
                yield queryRunner.manager.save(existingRatingMovie);
                const ratingMovies = yield queryRunner.manager.find(RatingMovies_1.RatingMovies, {
                    where: { movie },
                });
                const totalRatedPoint = ratingMovies === null || ratingMovies === void 0 ? void 0 : ratingMovies.reduce((totalPoint, point) => {
                    return totalPoint + point.ratedPoint;
                }, 0);
                console.log('Total Rated Point : ', totalRatedPoint);
                newMovie.point = Number(totalRatedPoint);
                yield queryRunner.manager.save(newMovie);
                const movies = yield queryRunner.manager.find(Movie_1.Movie, {
                    order: { point: 'DESC' },
                });
                movies.forEach((m, index) => __awaiter(this, void 0, void 0, function* () {
                    const rankMovie = queryRunner.manager.create(Movie_1.Movie, m);
                    rankMovie.rank = index + 1;
                    yield queryRunner.manager.save(rankMovie);
                }));
                let index = 0;
                for (const [, value] of Object.entries(movies)) {
                    const rankMovie = queryRunner.manager.create(Movie_1.Movie, value);
                    rankMovie.rank = index + 1;
                    index++;
                    yield queryRunner.manager.save(rankMovie);
                }
                yield queryRunner.commitTransaction();
                return {
                    movie: newMovie,
                };
            }
            catch (err) {
                console.log(err);
                yield queryRunner.rollbackTransaction();
                return {
                    errors: [
                        {
                            message: 'something went wrong!',
                        },
                    ],
                };
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => movie_1.MovieResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('option')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RatingInput]),
    __metadata("design:returntype", Promise)
], ratingResolvers.prototype, "ratingMovie", null);
ratingResolvers = __decorate([
    type_graphql_1.Resolver()
], ratingResolvers);
exports.ratingResolvers = ratingResolvers;
//# sourceMappingURL=ratingResolvers.js.map