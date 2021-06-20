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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterResolvers = exports.CharactersResponse = exports.CharacterResponse = void 0;
const error_1 = require("./../types/error");
const class_validator_1 = require("class-validator");
const helper_1 = require("./../utils/helper");
const Character_1 = require("./../entity/Character");
const graphql_upload_1 = require("graphql-upload");
const type_graphql_1 = require("type-graphql");
const fs_1 = require("fs");
const typeorm_1 = require("typeorm");
let CharacterResponse = class CharacterResponse {
};
__decorate([
    type_graphql_1.Field(() => Character_1.Character, { nullable: true }),
    __metadata("design:type", Character_1.Character)
], CharacterResponse.prototype, "character", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], CharacterResponse.prototype, "errors", void 0);
CharacterResponse = __decorate([
    type_graphql_1.ObjectType()
], CharacterResponse);
exports.CharacterResponse = CharacterResponse;
let CharactersResponse = class CharactersResponse {
};
__decorate([
    type_graphql_1.Field(() => [Character_1.Character], { nullable: true }),
    __metadata("design:type", Array)
], CharactersResponse.prototype, "characters", void 0);
__decorate([
    type_graphql_1.Field(() => [error_1.ErrorResponse], { nullable: true }),
    __metadata("design:type", Array)
], CharactersResponse.prototype, "errors", void 0);
CharactersResponse = __decorate([
    type_graphql_1.ObjectType()
], CharactersResponse);
exports.CharactersResponse = CharactersResponse;
let characterResolvers = class characterResolvers {
    createCharacter(username, photo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { createReadStream, filename } = photo;
                createReadStream().pipe(fs_1.createWriteStream(__dirname + `/../../public/profile/${filename}`));
                const character = new Character_1.Character();
                character.username = username;
                character.photo = `${helper_1.getEnvHost()}/profile/${filename}`;
                const errors = yield class_validator_1.validate(character);
                if (errors.length > 0) {
                    return {
                        errors: errors.map((error) => {
                            const { constraints, property } = error;
                            const key = Object.keys(constraints)[0];
                            return { field: property, message: constraints[key] };
                        }),
                    };
                }
                else {
                    yield typeorm_1.getManager().save(character);
                    return {
                        character,
                    };
                }
            }
            catch (err) {
                const { code } = err;
                if (code === '23505') {
                    const start = err.detail.indexOf('(');
                    const end = err.detail.indexOf(')');
                    return {
                        errors: [
                            {
                                field: err.detail.substring(start + 1, end),
                                message: 'Already exist!',
                            },
                        ],
                    };
                }
                return {
                    errors: err,
                };
            }
        });
    }
    getAllCharacter() {
        return __awaiter(this, void 0, void 0, function* () {
            const characters = yield typeorm_1.getConnection()
                .createQueryBuilder()
                .select('character')
                .from(Character_1.Character, 'character')
                .leftJoinAndSelect('character.movieCharacters', 'movieCharacters')
                .leftJoinAndSelect('movieCharacters.movie', 'movies')
                .getMany();
            if (!characters) {
                return {
                    errors: [
                        {
                            message: "Character doesn't exist",
                        },
                    ],
                };
            }
            return {
                characters,
            };
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => CharacterResponse),
    __param(0, type_graphql_1.Arg('username')),
    __param(1, type_graphql_1.Arg('photo', () => graphql_upload_1.GraphQLUpload)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], characterResolvers.prototype, "createCharacter", null);
__decorate([
    type_graphql_1.Query(() => CharactersResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], characterResolvers.prototype, "getAllCharacter", null);
characterResolvers = __decorate([
    type_graphql_1.Resolver()
], characterResolvers);
exports.characterResolvers = characterResolvers;
//# sourceMappingURL=characterResolvers.js.map