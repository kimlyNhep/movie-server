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
exports.Genre = void 0;
const type_graphql_1 = require("type-graphql");
const Movie_1 = require("./Movie");
const typeorm_1 = require("typeorm");
let Genre = class Genre extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Genre.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Genre.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [Movie_1.Movie], { nullable: true }),
    typeorm_1.ManyToMany(() => Movie_1.Movie, (movie) => movie.genres, { nullable: true }),
    typeorm_1.JoinTable({ name: 'genres_movies' }),
    __metadata("design:type", Array)
], Genre.prototype, "movies", void 0);
Genre = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Genre);
exports.Genre = Genre;
//# sourceMappingURL=Genre.js.map