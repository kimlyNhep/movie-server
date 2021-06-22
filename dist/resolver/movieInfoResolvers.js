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
exports.movieInfoResolvers = void 0;
const auth_1 = require("./../middleware/auth");
const MovieInfo_1 = require("./../entity/MovieInfo");
const typeorm_1 = require("typeorm");
const movie_1 = require("./../types/movie");
const type_graphql_1 = require("type-graphql");
const Movie_1 = require("../entity/Movie");
const class_validator_1 = require("class-validator");
let movieInfoResolvers = class movieInfoResolvers {
    updateMovieInfo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let info = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .select('info')
                .from(MovieInfo_1.MovieInfo, 'info')
                .where('info.movie = :id', { id: options.movie })
                .getOne();
            if (!info) {
                const movie = yield Movie_1.Movie.findOne({ where: { id: options.movie } });
                if (!movie) {
                    return {
                        errors: [
                            {
                                field: 'id',
                                message: "Movie doesn't exist",
                            },
                        ],
                    };
                }
                info = new MovieInfo_1.MovieInfo();
                info.movie = movie;
            }
            try {
                info.type = options.type;
                info.producer = options.producer;
                info.episode = options.episode;
                info.duration = options.durations;
                info.status = options.status;
                info.released_date = options.released_date;
                info.synopsis = options.synopsis;
                info.backgroundInfo = options.backgroundInfo;
                const errors = yield class_validator_1.validate(info);
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
                    yield typeorm_1.getConnection().manager.save(info);
                    return {
                        info,
                    };
                }
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
    createMovieInformation(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const movie = yield Movie_1.Movie.findOne({ where: { id: options.movie } });
            if (!movie) {
                return {
                    errors: [
                        {
                            message: 'Movie not exist',
                        },
                    ],
                };
            }
            const queryRunner = typeorm_1.getConnection().createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                let movieInfo = new MovieInfo_1.MovieInfo();
                movieInfo.type = options.type;
                movieInfo.producer = options.producer;
                movieInfo.episode = options.episode;
                movieInfo.duration = options.durations;
                movieInfo.status = options.status;
                movieInfo.released_date = options.released_date;
                movieInfo.synopsis = options.synopsis;
                movieInfo.backgroundInfo = options.backgroundInfo;
                movieInfo.movie = movie;
                const newMovieInfo = queryRunner.manager.create(MovieInfo_1.MovieInfo, movieInfo);
                yield queryRunner.manager.save(newMovieInfo);
                const errors = yield class_validator_1.validate(movieInfo);
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
                    yield queryRunner.commitTransaction();
                    return {
                        info: newMovieInfo,
                    };
                }
            }
            catch (err) {
                yield queryRunner.rollbackTransaction();
                return {
                    errors: [
                        {
                            message: 'fail',
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
    type_graphql_1.Mutation(() => movie_1.MovieInfoResponse),
    __param(0, type_graphql_1.Arg('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [movie_1.UpdateMovieInformationInput]),
    __metadata("design:returntype", Promise)
], movieInfoResolvers.prototype, "updateMovieInfo", null);
__decorate([
    type_graphql_1.Mutation(() => movie_1.MovieInfoResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Arg('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [movie_1.CreateMovieInformationInput]),
    __metadata("design:returntype", Promise)
], movieInfoResolvers.prototype, "createMovieInformation", null);
movieInfoResolvers = __decorate([
    type_graphql_1.Resolver()
], movieInfoResolvers);
exports.movieInfoResolvers = movieInfoResolvers;
//# sourceMappingURL=movieInfoResolvers.js.map