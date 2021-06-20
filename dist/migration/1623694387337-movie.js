"use strict";
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
exports.movie1623694387337 = void 0;
class movie1623694387337 {
    constructor() {
        this.name = 'movie1623694387337';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "PK_edd3bf97a671ccced5e631b7723"`);
            yield queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "PK_a01cda37421688720e7ea7406c8" PRIMARY KEY ("userId", "movieId")`);
            yield queryRunner.query(`ALTER TABLE "movie_state" DROP COLUMN "id"`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "movie_state" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
            yield queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "PK_a01cda37421688720e7ea7406c8"`);
            yield queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "PK_edd3bf97a671ccced5e631b7723" PRIMARY KEY ("id", "userId", "movieId")`);
        });
    }
}
exports.movie1623694387337 = movie1623694387337;
//# sourceMappingURL=1623694387337-movie.js.map