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
exports.GenreResponse = exports.GenresResponse = void 0;
const Genre_1 = require("./../entity/Genre");
const error_1 = require("../types/error");
const type_graphql_1 = require("type-graphql");
let GenresResponse = class GenresResponse {
};
__decorate([
    type_graphql_1.Field(() => [Genre_1.Genre], { nullable: true }),
    __metadata("design:type", Array)
], GenresResponse.prototype, "genres", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], GenresResponse.prototype, "errors", void 0);
GenresResponse = __decorate([
    type_graphql_1.ObjectType()
], GenresResponse);
exports.GenresResponse = GenresResponse;
let GenreResponse = class GenreResponse {
};
__decorate([
    type_graphql_1.Field(() => Genre_1.Genre, { nullable: true }),
    __metadata("design:type", Genre_1.Genre)
], GenreResponse.prototype, "genre", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], GenreResponse.prototype, "errors", void 0);
GenreResponse = __decorate([
    type_graphql_1.ObjectType()
], GenreResponse);
exports.GenreResponse = GenreResponse;
//# sourceMappingURL=genre.js.map