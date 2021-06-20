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
exports.Character = void 0;
const MovieCharacters_1 = require("./MovieCharacters");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let Character = class Character extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Character.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Character.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Character.prototype, "photo", void 0);
__decorate([
    type_graphql_1.Field(() => [MovieCharacters_1.MovieCharacters], { nullable: true }),
    typeorm_1.OneToMany(() => MovieCharacters_1.MovieCharacters, (movieCharacter) => movieCharacter.character, { nullable: true }),
    __metadata("design:type", Array)
], Character.prototype, "movieCharacters", void 0);
Character = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Character);
exports.Character = Character;
//# sourceMappingURL=Character.js.map