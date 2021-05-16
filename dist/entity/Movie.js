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
exports.Movie = void 0;
const Genre_1 = require("./Genre");
const MovieInfo_1 = require("./MovieInfo");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
const typeorm_1 = require("typeorm");
const RatingMovies_1 = require("./RatingMovies");
let Movie = class Movie extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Movie.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Movie.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Movie.prototype, "photo", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: false }),
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.movies, {
        cascade: true,
        nullable: false,
    }),
    __metadata("design:type", User_1.User)
], Movie.prototype, "creator", void 0);
__decorate([
    type_graphql_1.Field(() => MovieInfo_1.MovieInfo, { nullable: true }),
    typeorm_1.OneToOne(() => MovieInfo_1.MovieInfo, (info) => info.movie),
    __metadata("design:type", MovieInfo_1.MovieInfo)
], Movie.prototype, "info", void 0);
__decorate([
    type_graphql_1.Field(() => [Genre_1.Genre]),
    typeorm_1.ManyToMany(() => Genre_1.Genre, (genre) => genre.movies),
    __metadata("design:type", Array)
], Movie.prototype, "genres", void 0);
__decorate([
    type_graphql_1.Field(() => [RatingMovies_1.RatingMovies], { nullable: true }),
    typeorm_1.OneToMany(() => RatingMovies_1.RatingMovies, (ratingMovie) => ratingMovie.movie, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], Movie.prototype, "ratingMovies", void 0);
Movie = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Movie);
exports.Movie = Movie;
//# sourceMappingURL=Movie.js.map