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
exports.User = void 0;
const MovieState_1 = require("./MovieState");
const Movie_1 = require("./Movie");
const enumType_1 = require("./../enumType");
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const RatingMovies_1 = require("./RatingMovies");
const Comment_1 = require("./Comment");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.IsEmail({}, { message: 'Invalid Email Format!' }),
    typeorm_1.Column('text', { nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column('text', { nullable: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    class_validator_1.IsEnum(enumType_1.UserRoles, { each: true }),
    typeorm_1.Column({
        type: 'enum',
        enum: enumType_1.UserRoles,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(() => [Movie_1.Movie]),
    typeorm_1.OneToMany(() => Movie_1.Movie, (movie) => movie.creator),
    __metadata("design:type", Array)
], User.prototype, "movies", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "photo", void 0);
__decorate([
    type_graphql_1.Field(() => [RatingMovies_1.RatingMovies], { nullable: true }),
    typeorm_1.OneToMany(() => RatingMovies_1.RatingMovies, (ratingMovie) => ratingMovie.user, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "ratingMovies", void 0);
__decorate([
    type_graphql_1.Field(() => [Comment_1.Comment], { nullable: true }),
    typeorm_1.OneToMany(() => Comment_1.Comment, (comment) => comment.user, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "comment", void 0);
__decorate([
    type_graphql_1.Field(() => [MovieState_1.MovieState], { nullable: true }),
    typeorm_1.OneToMany(() => MovieState_1.MovieState, (movieState) => movieState.user, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "movieState", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
User = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map