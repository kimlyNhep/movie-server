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
exports.MovieState = void 0;
const Movie_1 = require("./Movie");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let MovieState = class MovieState extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MovieState.prototype, "watching", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MovieState.prototype, "planToWatch", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MovieState.prototype, "completed", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MovieState.prototype, "drop", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: false }),
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.movieState, {
        nullable: false,
        primary: true,
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_1.User)
], MovieState.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => Movie_1.Movie, { nullable: false }),
    typeorm_1.ManyToOne(() => Movie_1.Movie, (movie) => movie.movieState, {
        primary: true,
        nullable: false,
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Movie_1.Movie)
], MovieState.prototype, "movie", void 0);
MovieState = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], MovieState);
exports.MovieState = MovieState;
//# sourceMappingURL=MovieState.js.map