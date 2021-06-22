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
exports.UserMovieStateResponse = exports.MovieStateResponse = void 0;
const User_1 = require("./../entity/User");
const Movie_1 = require("./../entity/Movie");
const type_graphql_1 = require("type-graphql");
const error_1 = require("./error");
let MovieStateResponse = class MovieStateResponse {
};
__decorate([
    type_graphql_1.Field(() => Movie_1.Movie, { nullable: true }),
    __metadata("design:type", Movie_1.Movie)
], MovieStateResponse.prototype, "movie", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], MovieStateResponse.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], MovieStateResponse.prototype, "errors", void 0);
MovieStateResponse = __decorate([
    type_graphql_1.ObjectType()
], MovieStateResponse);
exports.MovieStateResponse = MovieStateResponse;
let UserMovieStateResponse = class UserMovieStateResponse {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], UserMovieStateResponse.prototype, "watching", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], UserMovieStateResponse.prototype, "completed", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], UserMovieStateResponse.prototype, "planToWatch", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], UserMovieStateResponse.prototype, "drop", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], UserMovieStateResponse.prototype, "errors", void 0);
UserMovieStateResponse = __decorate([
    type_graphql_1.ObjectType()
], UserMovieStateResponse);
exports.UserMovieStateResponse = UserMovieStateResponse;
//# sourceMappingURL=movieState.js.map