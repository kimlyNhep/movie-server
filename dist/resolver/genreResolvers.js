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
exports.genreResolvers = void 0;
const auth_1 = require("./../middleware/auth");
const genre_1 = require("./../types/genre");
const Genre_1 = require("./../entity/Genre");
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let genreResolvers = class genreResolvers {
    createGenre(name, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const genre = new Genre_1.Genre();
            genre.name = name;
            const errors = yield class_validator_1.validate(genre);
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
                try {
                    const newGenre = yield typeorm_1.getManager().save(genre);
                    return {
                        genre: newGenre,
                    };
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
            }
        });
    }
    getGenres() {
        return __awaiter(this, void 0, void 0, function* () {
            const genreQuery = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .select('genres')
                .from(Genre_1.Genre, 'genres')
                .getMany();
            return {
                genres: genreQuery,
            };
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => genre_1.GenreResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth, auth_1.isAdmin),
    __param(0, type_graphql_1.Arg('name')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], genreResolvers.prototype, "createGenre", null);
__decorate([
    type_graphql_1.Query(() => genre_1.GenresResponse),
    type_graphql_1.UseMiddleware(auth_1.isAuth),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], genreResolvers.prototype, "getGenres", null);
genreResolvers = __decorate([
    type_graphql_1.Resolver()
], genreResolvers);
exports.genreResolvers = genreResolvers;
//# sourceMappingURL=genreResolvers.js.map