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
exports.uploadResolver = void 0;
const typeorm_1 = require("typeorm");
const error_1 = require("../types/error");
const type_graphql_1 = require("type-graphql");
const Movie_1 = require("./../entity/Movie");
const type_graphql_2 = require("type-graphql");
const type_graphql_3 = require("type-graphql");
const graphql_upload_1 = require("graphql-upload");
const fs_1 = require("fs");
let MovieUploadResponse = class MovieUploadResponse {
};
__decorate([
    type_graphql_2.Field({ nullable: true }),
    __metadata("design:type", String)
], MovieUploadResponse.prototype, "imageUrl", void 0);
__decorate([
    type_graphql_2.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], MovieUploadResponse.prototype, "errors", void 0);
MovieUploadResponse = __decorate([
    type_graphql_1.ObjectType()
], MovieUploadResponse);
let uploadResolver = class uploadResolver {
    uploadMoviePhoto(id, photo) {
        return __awaiter(this, void 0, void 0, function* () {
            const movie = yield Movie_1.Movie.findOne({ where: { id } });
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
            const { createReadStream, filename } = photo;
            createReadStream().pipe(fs_1.createWriteStream(__dirname + `/../../public/images/${filename}`));
            movie.photo = `https://movie-academy.herokuapp.com/images/${filename}`;
            try {
                yield typeorm_1.getManager().save(movie);
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
            return {
                imageUrl: `https://movie-academy.herokuapp.com/images/${filename}`,
            };
        });
    }
};
__decorate([
    type_graphql_3.Mutation(() => MovieUploadResponse),
    __param(0, type_graphql_3.Arg('id')),
    __param(1, type_graphql_3.Arg('photo', () => graphql_upload_1.GraphQLUpload)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], uploadResolver.prototype, "uploadMoviePhoto", null);
uploadResolver = __decorate([
    type_graphql_3.Resolver()
], uploadResolver);
exports.uploadResolver = uploadResolver;
//# sourceMappingURL=uploadResolvers.js.map