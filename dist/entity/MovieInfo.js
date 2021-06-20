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
exports.MovieInfo = void 0;
const Movie_1 = require("./Movie");
const enumType_1 = require("./../enumType");
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let MovieInfo = class MovieInfo extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], MovieInfo.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    class_validator_1.IsEnum(enumType_1.MovieType, { each: true, message: 'Invalid Movie Type!' }),
    typeorm_1.Column({
        type: 'enum',
        enum: enumType_1.MovieType,
        nullable: false,
    }),
    __metadata("design:type", String)
], MovieInfo.prototype, "type", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], MovieInfo.prototype, "producer", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], MovieInfo.prototype, "episode", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    class_validator_1.IsEnum(enumType_1.StatusType, { each: true, message: 'Invalid Status Type!' }),
    typeorm_1.Column({
        type: 'enum',
        enum: enumType_1.StatusType,
        nullable: false,
    }),
    __metadata("design:type", String)
], MovieInfo.prototype, "status", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], MovieInfo.prototype, "synopsis", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], MovieInfo.prototype, "backgroundInfo", void 0);
__decorate([
    type_graphql_1.Field(() => Number, { nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], MovieInfo.prototype, "duration", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], MovieInfo.prototype, "released_date", void 0);
__decorate([
    type_graphql_1.Field(() => Movie_1.Movie),
    typeorm_1.OneToOne(() => Movie_1.Movie),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Movie_1.Movie)
], MovieInfo.prototype, "movie", void 0);
MovieInfo = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], MovieInfo);
exports.MovieInfo = MovieInfo;
//# sourceMappingURL=MovieInfo.js.map