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
exports.UpdateMovieInformationInput = exports.CreateMovieInformationInput = exports.UploadInput = exports.UpdateMovieInput = exports.CreateMovieInput = exports.MovieInfoResponse = exports.MoviesResponse = exports.MovieResponse = void 0;
const error_1 = require("../types/error");
const enumType_1 = require("./../enumType");
const type_graphql_1 = require("type-graphql");
const stream_1 = require("stream");
const Movie_1 = require("../entity/Movie");
const MovieInfo_1 = require("../entity/MovieInfo");
type_graphql_1.registerEnumType(enumType_1.MovieType, {
    name: 'MovieType',
});
type_graphql_1.registerEnumType(enumType_1.StatusType, {
    name: 'StatusType',
});
let MovieResponse = class MovieResponse {
};
__decorate([
    type_graphql_1.Field(() => Movie_1.Movie, { nullable: true }),
    __metadata("design:type", Movie_1.Movie)
], MovieResponse.prototype, "movie", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], MovieResponse.prototype, "errors", void 0);
MovieResponse = __decorate([
    type_graphql_1.ObjectType()
], MovieResponse);
exports.MovieResponse = MovieResponse;
let MoviesResponse = class MoviesResponse {
};
__decorate([
    type_graphql_1.Field(() => [Movie_1.Movie], { nullable: true }),
    __metadata("design:type", Array)
], MoviesResponse.prototype, "movies", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], MoviesResponse.prototype, "errors", void 0);
MoviesResponse = __decorate([
    type_graphql_1.ObjectType()
], MoviesResponse);
exports.MoviesResponse = MoviesResponse;
let MovieInfoResponse = class MovieInfoResponse {
};
__decorate([
    type_graphql_1.Field(() => MovieInfo_1.MovieInfo, { nullable: true }),
    __metadata("design:type", MovieInfo_1.MovieInfo)
], MovieInfoResponse.prototype, "info", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], MovieInfoResponse.prototype, "errors", void 0);
MovieInfoResponse = __decorate([
    type_graphql_1.ObjectType()
], MovieInfoResponse);
exports.MovieInfoResponse = MovieInfoResponse;
let CreateMovieInput = class CreateMovieInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CreateMovieInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateMovieInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => [String]),
    __metadata("design:type", Array)
], CreateMovieInput.prototype, "genres", void 0);
CreateMovieInput = __decorate([
    type_graphql_1.InputType()
], CreateMovieInput);
exports.CreateMovieInput = CreateMovieInput;
let UpdateMovieInput = class UpdateMovieInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UpdateMovieInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UpdateMovieInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateMovieInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => [String]),
    __metadata("design:type", Array)
], UpdateMovieInput.prototype, "genres", void 0);
UpdateMovieInput = __decorate([
    type_graphql_1.InputType()
], UpdateMovieInput);
exports.UpdateMovieInput = UpdateMovieInput;
let UploadInput = class UploadInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UploadInput.prototype, "filename", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UploadInput.prototype, "mimeType", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UploadInput.prototype, "encoding", void 0);
__decorate([
    type_graphql_1.Field(() => stream_1.Stream),
    __metadata("design:type", Function)
], UploadInput.prototype, "createReadStream", void 0);
UploadInput = __decorate([
    type_graphql_1.InputType()
], UploadInput);
exports.UploadInput = UploadInput;
let CharacterInput = class CharacterInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CharacterInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CharacterInput.prototype, "role", void 0);
CharacterInput = __decorate([
    type_graphql_1.InputType()
], CharacterInput);
let CreateMovieInformationInput = class CreateMovieInformationInput {
};
__decorate([
    type_graphql_1.Field(() => enumType_1.MovieType),
    __metadata("design:type", String)
], CreateMovieInformationInput.prototype, "type", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateMovieInformationInput.prototype, "producer", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], CreateMovieInformationInput.prototype, "episode", void 0);
__decorate([
    type_graphql_1.Field(() => enumType_1.StatusType),
    __metadata("design:type", String)
], CreateMovieInformationInput.prototype, "status", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], CreateMovieInformationInput.prototype, "durations", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateMovieInformationInput.prototype, "released_date", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], CreateMovieInformationInput.prototype, "movie", void 0);
__decorate([
    type_graphql_1.Field(() => [CharacterInput], { nullable: true }),
    __metadata("design:type", Array)
], CreateMovieInformationInput.prototype, "characters", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateMovieInformationInput.prototype, "synopsis", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateMovieInformationInput.prototype, "backgroundInfo", void 0);
CreateMovieInformationInput = __decorate([
    type_graphql_1.InputType()
], CreateMovieInformationInput);
exports.CreateMovieInformationInput = CreateMovieInformationInput;
let UpdateMovieInformationInput = class UpdateMovieInformationInput {
};
__decorate([
    type_graphql_1.Field(() => enumType_1.MovieType),
    __metadata("design:type", String)
], UpdateMovieInformationInput.prototype, "type", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateMovieInformationInput.prototype, "producer", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], UpdateMovieInformationInput.prototype, "episode", void 0);
__decorate([
    type_graphql_1.Field(() => enumType_1.StatusType),
    __metadata("design:type", String)
], UpdateMovieInformationInput.prototype, "status", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], UpdateMovieInformationInput.prototype, "durations", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateMovieInformationInput.prototype, "released_date", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], UpdateMovieInformationInput.prototype, "movie", void 0);
__decorate([
    type_graphql_1.Field(() => [CharacterInput], { nullable: true }),
    __metadata("design:type", Array)
], UpdateMovieInformationInput.prototype, "characters", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateMovieInformationInput.prototype, "synopsis", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateMovieInformationInput.prototype, "backgroundInfo", void 0);
UpdateMovieInformationInput = __decorate([
    type_graphql_1.InputType()
], UpdateMovieInformationInput);
exports.UpdateMovieInformationInput = UpdateMovieInformationInput;
//# sourceMappingURL=movie.js.map