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
exports.MovieCharacters = void 0;
const Character_1 = require("./Character");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Movie_1 = require("./Movie");
let MovieCharacters = class MovieCharacters {
};
__decorate([
    type_graphql_1.Field(() => Character_1.Character),
    typeorm_1.JoinColumn({ name: 'characterId' }),
    typeorm_1.ManyToOne(() => Character_1.Character, (character) => character.movieCharacters, {
        primary: true,
    }),
    __metadata("design:type", Character_1.Character)
], MovieCharacters.prototype, "character", void 0);
__decorate([
    type_graphql_1.Field(() => Movie_1.Movie),
    typeorm_1.JoinColumn({ name: 'movieId' }),
    typeorm_1.ManyToOne(() => Movie_1.Movie, (movie) => movie.movieCharacters, { primary: true }),
    __metadata("design:type", Movie_1.Movie)
], MovieCharacters.prototype, "movie", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], MovieCharacters.prototype, "role", void 0);
MovieCharacters = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity('movie_characters')
], MovieCharacters);
exports.MovieCharacters = MovieCharacters;
//# sourceMappingURL=MovieCharacters.js.map