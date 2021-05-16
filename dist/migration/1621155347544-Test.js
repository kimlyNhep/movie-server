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
exports.Test1621155347544 = void 0;
class Test1621155347544 {
    constructor() {
        this.name = 'Test1621155347544';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "rating_movies" ("ratedPoint" integer NOT NULL, "userId" uuid NOT NULL, "movieId" uuid NOT NULL, CONSTRAINT "PK_6d6ae29a041cfa3e5c71e8e60c3" PRIMARY KEY ("userId", "movieId"))`);
            yield queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "username" text NOT NULL, "role" "user_role_enum" NOT NULL, "password" text NOT NULL, "photo" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "movie_characters" ("role" character varying, "userId" uuid NOT NULL, "movieinfoId" uuid NOT NULL, CONSTRAINT "PK_9de2f926022cdb17d4649de1a16" PRIMARY KEY ("userId", "movieinfoId"))`);
            yield queryRunner.query(`CREATE TABLE "movie_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "movie_info_type_enum" NOT NULL, "producer" character varying, "episode" integer, "status" "movie_info_status_enum" NOT NULL, "synopsis" character varying, "backgroundInfo" character varying, "duration" integer, "released_date" character varying, "movieId" uuid, CONSTRAINT "REL_47e54c56b1a7b93a6b5e1f6587" UNIQUE ("movieId"), CONSTRAINT "PK_f263ca2fcf978d138a6dd163a7b" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "movie" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "photo" character varying, "creatorId" uuid NOT NULL, CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title"), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "genre" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name"), CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "genres_movies" ("genreId" uuid NOT NULL, "movieId" uuid NOT NULL, CONSTRAINT "PK_6f0b2c7572b5ac9fefc7a043130" PRIMARY KEY ("genreId", "movieId"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_07db9d2ece40a24ee3bffa4a6a" ON "genres_movies" ("genreId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_1b7599300cde8961f46cef52b0" ON "genres_movies" ("movieId") `);
            yield queryRunner.query(`ALTER TABLE "rating_movies" ADD CONSTRAINT "FK_25efa41d4a2410df89c92b436f4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "rating_movies" ADD CONSTRAINT "FK_a059e789ae41b5616401ab11f95" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "movie_characters" ADD CONSTRAINT "FK_1f5ccfd62ce88d8413a2cb05118" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "movie_characters" ADD CONSTRAINT "FK_825fe0036a292bf009d93422947" FOREIGN KEY ("movieinfoId") REFERENCES "movie_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "movie_info" ADD CONSTRAINT "FK_47e54c56b1a7b93a6b5e1f6587b" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "FK_b55916de756e46290d52c70fc04" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "genres_movies" ADD CONSTRAINT "FK_07db9d2ece40a24ee3bffa4a6aa" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "genres_movies" ADD CONSTRAINT "FK_1b7599300cde8961f46cef52b09" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "genres_movies" DROP CONSTRAINT "FK_1b7599300cde8961f46cef52b09"`);
            yield queryRunner.query(`ALTER TABLE "genres_movies" DROP CONSTRAINT "FK_07db9d2ece40a24ee3bffa4a6aa"`);
            yield queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "FK_b55916de756e46290d52c70fc04"`);
            yield queryRunner.query(`ALTER TABLE "movie_info" DROP CONSTRAINT "FK_47e54c56b1a7b93a6b5e1f6587b"`);
            yield queryRunner.query(`ALTER TABLE "movie_characters" DROP CONSTRAINT "FK_825fe0036a292bf009d93422947"`);
            yield queryRunner.query(`ALTER TABLE "movie_characters" DROP CONSTRAINT "FK_1f5ccfd62ce88d8413a2cb05118"`);
            yield queryRunner.query(`ALTER TABLE "rating_movies" DROP CONSTRAINT "FK_a059e789ae41b5616401ab11f95"`);
            yield queryRunner.query(`ALTER TABLE "rating_movies" DROP CONSTRAINT "FK_25efa41d4a2410df89c92b436f4"`);
            yield queryRunner.query(`DROP INDEX "IDX_1b7599300cde8961f46cef52b0"`);
            yield queryRunner.query(`DROP INDEX "IDX_07db9d2ece40a24ee3bffa4a6a"`);
            yield queryRunner.query(`DROP TABLE "genres_movies"`);
            yield queryRunner.query(`DROP TABLE "genre"`);
            yield queryRunner.query(`DROP TABLE "movie"`);
            yield queryRunner.query(`DROP TABLE "movie_info"`);
            yield queryRunner.query(`DROP TABLE "movie_characters"`);
            yield queryRunner.query(`DROP TABLE "user"`);
            yield queryRunner.query(`DROP TABLE "rating_movies"`);
        });
    }
}
exports.Test1621155347544 = Test1621155347544;
//# sourceMappingURL=1621155347544-Test.js.map