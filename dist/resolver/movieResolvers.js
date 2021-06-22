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
exports.movieResolvers = void 0;
const MovieCharacters_1 = require("./../entity/MovieCharacters");
const Character_1 = require("./../entity/Character");
const auth_1 = require("./../middleware/auth");
const Genre_1 = require("./../entity/Genre");
const User_1 = require("./../entity/User");
const Movie_1 = require("./../entity/Movie");
const movie_1 = require("./../types/movie");
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let movieResolvers = class movieResolvers {
    updateMovie(options) {
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
            const genres = yield typeorm_1.getRepository(Genre_1.Genre).findByIds(options.genres);
            if (genres.length < options.genres.length)
                return {
                    errors: [
                        {
                            message: "Genre doesn't exist",
                        },
                    ],
                };
            let characters;
            if (options.characters) {
                characters = yield typeorm_1.getRepository(Character_1.Character).findByIds(options.characters);
                if (characters.length < options.characters.length)
                    return {
                        errors: [
                            {
                                message: "Character doesn't exist",
                            },
                        ],
                    };
            }
            const characterWithRole = characters === null || characters === void 0 ? void 0 : characters.map((item, index) => {
                if (item.id === options.characters[index].id) {
                    return { character: item, role: options.characters[index].role };
                }
                return null;
            });
            movie.title = options.title;
            movie.description = options.description;
            movie.genres = genres;
            const errors = yield class_validator_1.validate(movie);
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
                const queryRunner = typeorm_1.getConnection().createQueryRunner();
                yield queryRunner.connect();
                yield queryRunner.startTransaction();
                try {
                    const newMovie = queryRunner.manager.create(Movie_1.Movie, movie);
                    yield queryRunner.manager.save(newMovie);
                    yield typeorm_1.getConnection()
                        .createQueryBuilder()
                        .delete()
                        .from(MovieCharacters_1.MovieCharacters)
                        .where('movieId = :id', { id: options.id })
                        .execute();
                    for (const [, value] of Object.entries(characterWithRole)) {
                        const moviesCharacters = new MovieCharacters_1.MovieCharacters();
                        moviesCharacters.movie = newMovie;
                        moviesCharacters.character = value.character;
                        moviesCharacters.role = value.role;
                        const newMoviesCharacters = queryRunner.manager.create(MovieCharacters_1.MovieCharacters, moviesCharacters);
                        yield queryRunner.manager.save(newMoviesCharacters);
                    }
                    yield queryRunner.commitTransaction();
                    return {
                        movie: newMovie,
                    };
                }
                catch (err) {
                    queryRunner.rollbackTransaction();
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
            }
        });
    }
    createMovie({ payload }, options) {
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
            const genres = yield typeorm_1.getRepository(Genre_1.Genre).findByIds(options.genres);
            if (genres.length < options.genres.length)
                return {
                    errors: [
                        {
                            message: "Genre doesn't exist",
                        },
                    ],
                };
            const movie = new Movie_1.Movie();
            movie.title = options.title;
            movie.description = options.description;
            movie.creator = user;
            movie.genres = genres;
            movie.point = 0;
            movie.photo =
                'https://drive.google.com/uc?export=download&id=1ztVtldH1LBlJkgbqdR3MzusmFLSUbtva';
            let characters;
            if (options.characters) {
                characters = yield typeorm_1.getRepository(Character_1.Character).findByIds(options.characters.map((item) => item.id));
                if (characters.length < options.characters.length)
                    return {
                        errors: [
                            {
                                message: "Character doesn't exist",
                            },
                        ],
                    };
            }
            const characterWithRole = characters === null || characters === void 0 ? void 0 : characters.map((item, index) => {
                if (item.id === options.characters[index].id) {
                    return { character: item, role: options.characters[index].role };
                }
                return null;
            });
            const errors = yield class_validator_1.validate(movie);
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
                const queryRunner = typeorm_1.getConnection().createQueryRunner();
                yield queryRunner.connect();
                yield queryRunner.startTransaction();
                try {
                    const newMovie = queryRunner.manager.create(Movie_1.Movie, movie);
                    yield queryRunner.manager.save(newMovie);
                    for (const [, value] of Object.entries(characterWithRole)) {
                        const moviesCharacters = new MovieCharacters_1.MovieCharacters();
                        moviesCharacters.movie = newMovie;
                        moviesCharacters.character = value.character;
                        moviesCharacters.role = value.role;
                        const newMoviesCharacters = queryRunner.manager.create(MovieCharacters_1.MovieCharacters, moviesCharacters);
                        yield queryRunner.manager.save(newMoviesCharacters);
                    }
                    yield queryRunner.commitTransaction();
                    return {
                        movie: newMovie,
                    };
                }
                catch (err) {
                    queryRunner.rollbackTransaction();
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
                finally {
                    yield queryRunner.release();
                }
            }
        });
    }
    getMovie(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const movieQuery = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .select('movie')
                .from(Movie_1.Movie, 'movie')
                .where('movie.id = :id', { id })
                .innerJoinAndSelect('movie.creator', 'creator')
                .innerJoinAndSelect('movie.genres', 'genres')
                .leftJoinAndSelect('movie.ratingMovies', 'ratingMovies')
                .leftJoinAndSelect('movie.comment', 'comment')
                .leftJoinAndSelect('comment.user', 'users')
                .leftJoinAndSelect('movie.movieCharacters', 'movieCharacters')
                .leftJoinAndSelect('movieCharacters.character', 'characters')
                .leftJoinAndSelect('ratingMovies.user', 'ratedUsers')
                .leftJoinAndSelect('movie.info', 'info')
                .leftJoinAndSelect('movie.movieState', 'movieState')
                .orderBy('comment.createdAt', 'ASC')
                .getOne();
            if (!movieQuery) {
                return {
                    errors: [
                        {
                            field: 'id',
                            message: 'Movie not exist',
                        },
                    ],
                };
            }
            return {
                movie: movieQuery,
            };
        });
    }
    getMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            const moviesQuery = yield typeorm_1.getConnection()
                .createQueryBuilder(Movie_1.Movie, 'movie')
                .innerJoinAndSelect('movie.creator', 'creator')
                .innerJoinAndSelect('movie.genres', 'genres')
                .leftJoinAndSelect('movie.ratingMovies', 'ratingMovies')
                .leftJoinAndSelect('movie.comment', 'comment')
                .leftJoinAndSelect('comment.user', 'users')
                .leftJoinAndSelect('movie.movieCharacters', 'movieCharacters')
                .leftJoinAndSelect('movieCharacters.character', 'characters')
                .leftJoinAndSelect('ratingMovies.user', 'ratedUsers')
                .leftJoinAndSelect('movie.info', 'info')
                .getMany();
            return {
                movies: moviesQuery,
            };
        });
    }
    getMoviesByYear(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const moviesQuery = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .select('movie')
                .from(Movie_1.Movie, 'movie')
                .orderBy('movie.title', 'ASC')
                .innerJoinAndSelect('movie.creator', 'creator')
                .innerJoinAndSelect('movie.genres', 'genres')
                .leftJoinAndSelect('movie.info', 'info')
                .where(`info.released_date like '%${year}%'`)
                .leftJoinAndSelect('info.movieCharacters', 'movieCharacters')
                .leftJoinAndSelect('movieCharacters.characters', 'characters')
                .getMany();
            return {
                movies: moviesQuery,
            };
        });
    }
    getRankingMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            const moviesQuery = yield typeorm_1.getConnection()
                .createQueryBuilder(Movie_1.Movie, 'movie')
                .innerJoinAndSelect('movie.creator', 'creator')
                .innerJoinAndSelect('movie.genres', 'genres')
                .leftJoinAndSelect('movie.ratingMovies', 'ratingMovies')
                .leftJoinAndSelect('movie.comment', 'comment')
                .leftJoinAndSelect('comment.user', 'users')
                .leftJoinAndSelect('movie.movieCharacters', 'movieCharacters')
                .leftJoinAndSelect('movieCharacters.character', 'characters')
                .leftJoinAndSelect('ratingMovies.user', 'ratedUsers')
                .leftJoinAndSelect('movie.info', 'info')
                .orderBy('movie.point', 'DESC')
                .getMany();
            const movies = moviesQuery.map((item, index) => ({
                rankingMovie: item,
                rank: index + 1,
            }));
            return {
                movies,
            };
        });
    }
    getMoviesByUser({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const movies = yield typeorm_1.getConnection()
                .createQueryBuilder(Movie_1.Movie, 'movie')
                .where('movie.creatorId = :uid', { uid: payload === null || payload === void 0 ? void 0 : payload.id })
                .getMany();
            return {
                movies,
            };
        });
    }
    getTopMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            const movies = yield typeorm_1.getConnection()
                .createQueryBuilder(Movie_1.Movie, 'movie')
                .orderBy('movie.rank', 'ASC')
                .limit(5)
                .getMany();
            return {
                movies,
            };
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => movie_1.MovieResponse),
    __param(0, type_graphql_1.Arg('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [movie_1.UpdateMovieInput]),
    __metadata("design:returntype", Promise)
], movieResolvers.prototype, "updateMovie", null);
__decorate([
    type_graphql_1.Mutation(() => movie_1.MovieResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, movie_1.CreateMovieInput]),
    __metadata("design:returntype", Promise)
], movieResolvers.prototype, "createMovie", null);
__decorate([
    type_graphql_1.Query(() => movie_1.MovieResponse),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], movieResolvers.prototype, "getMovie", null);
__decorate([
    type_graphql_1.Query(() => movie_1.MoviesResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], movieResolvers.prototype, "getMovies", null);
__decorate([
    type_graphql_1.Query(() => movie_1.MoviesResponse),
    __param(0, type_graphql_1.Arg('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], movieResolvers.prototype, "getMoviesByYear", null);
__decorate([
    type_graphql_1.Query(() => movie_1.MovieRankingResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], movieResolvers.prototype, "getRankingMovies", null);
__decorate([
    type_graphql_1.Query(() => movie_1.MoviesResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], movieResolvers.prototype, "getMoviesByUser", null);
__decorate([
    type_graphql_1.Query(() => movie_1.MoviesResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], movieResolvers.prototype, "getTopMovies", null);
movieResolvers = __decorate([
    type_graphql_1.Resolver()
], movieResolvers);
exports.movieResolvers = movieResolvers;
//# sourceMappingURL=movieResolvers.js.map