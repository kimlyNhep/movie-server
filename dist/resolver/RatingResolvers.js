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
const jsonwebtoken_1 = require("jsonwebtoken");
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
    ratingMovie({ req }, option) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.cookies;
            const { id } = jsonwebtoken_1.decode(token);
            const user = yield User_1.User.findOne({ where: { id } });
            if (!user) {
                return {
                    errors: [
                        {
                            message: 'User not exist',
                        },
                    ],
                };
            }
            const movie = yield typeorm_1.getConnection()
                .getRepository(Movie_1.Movie)
                .findOne({ where: { id: option.movieId } });
            if (!movie) {
                return {
                    errors: [
                        {
                            message: "Movie doesn't exist",
                        },
                    ],
                };
            }
            const ratingMovies = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .from(RatingMovies_1.RatingMovies, 'ratingMovies')
                .where('userId = :uid', { uid: user.id })
                .andWhere('movieId = :mid', { mid: movie.id });
            if (ratingMovies) {
                yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .delete()
                    .from(RatingMovies_1.RatingMovies)
                    .where('userId = :uid', { uid: user.id })
                    .andWhere('movieId = :mid', { mid: movie.id })
                    .execute();
            }
            const newRatingMovies = new RatingMovies_1.RatingMovies();
            newRatingMovies.movie = movie;
            newRatingMovies.user = user;
            newRatingMovies.ratedPoint = option.ratedPoint;
            try {
                yield typeorm_1.getConnection().manager.save(newRatingMovies);
                return {
                    movie,
                };
            }
            catch (err) {
                return {
                    errors: [
                        {
                            message: 'fail',
                        },
                    ],
                };
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