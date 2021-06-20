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
exports.movie1623694210314 = void 0;
class movie1623694210314 {
    constructor() {
        this.name = 'movie1623694210314';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "PK_88cb06497f5f8278a93b5526e44"`);
            yield queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "PK_edd3bf97a671ccced5e631b7723" PRIMARY KEY ("id", "userId", "movieId")`);
            yield queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "FK_54ae12c7f2813b6aba9294fea91"`);
            yield queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "FK_26e9b61de5c82c98d3eca9b1fb9"`);
            yield queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "REL_54ae12c7f2813b6aba9294fea9"`);
            yield queryRunner.query(`ALTER TABLE "movie_state" ALTER COLUMN "movieId" SET NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "FK_54ae12c7f2813b6aba9294fea91" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "FK_26e9b61de5c82c98d3eca9b1fb9" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "FK_26e9b61de5c82c98d3eca9b1fb9"`);
            yield queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "FK_54ae12c7f2813b6aba9294fea91"`);
            yield queryRunner.query(`ALTER TABLE "movie_state" ALTER COLUMN "movieId" DROP NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "REL_54ae12c7f2813b6aba9294fea9" UNIQUE ("userId")`);
            yield queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "FK_26e9b61de5c82c98d3eca9b1fb9" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "FK_54ae12c7f2813b6aba9294fea91" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "PK_edd3bf97a671ccced5e631b7723"`);
            yield queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "PK_88cb06497f5f8278a93b5526e44" PRIMARY KEY ("id")`);
        });
    }
}
exports.movie1623694210314 = movie1623694210314;
//# sourceMappingURL=1623694210314-movie.js.map