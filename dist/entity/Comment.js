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
exports.Comment = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Movie_1 = require("./Movie");
const User_1 = require("./User");
let Comment = class Comment {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Comment.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User),
    typeorm_1.JoinColumn({ name: 'userId' }),
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.comment),
    __metadata("design:type", User_1.User)
], Comment.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => Movie_1.Movie),
    typeorm_1.JoinColumn({ name: 'movieId' }),
    typeorm_1.ManyToOne(() => Movie_1.Movie, (movie) => movie.comment),
    __metadata("design:type", Movie_1.Movie)
], Comment.prototype, "movie", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Comment.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], Comment.prototype, "createdAt", void 0);
Comment = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity('comment')
], Comment);
exports.Comment = Comment;
//# sourceMappingURL=Comment.js.map