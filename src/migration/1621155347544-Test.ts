import {MigrationInterface, QueryRunner} from "typeorm";

export class Test1621155347544 implements MigrationInterface {
    name = 'Test1621155347544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('Admin', 'Member', 'Character')`);
        await queryRunner.query(`CREATE TYPE "movie_info_type_enum" AS ENUM('Tv', 'Movie')`);
        await queryRunner.query(`CREATE TYPE "movie_info_status_enum" AS ENUM('Completed', 'Ongoing')`);
        await queryRunner.query(`CREATE TABLE "rating_movies" ("ratedPoint" integer NOT NULL, "userId" uuid NOT NULL, "movieId" uuid NOT NULL, CONSTRAINT "PK_6d6ae29a041cfa3e5c71e8e60c3" PRIMARY KEY ("userId", "movieId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "username" text NOT NULL, "role" "user_role_enum" NOT NULL, "password" text NOT NULL, "photo" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie_characters" ("role" character varying, "userId" uuid NOT NULL, "movieinfoId" uuid NOT NULL, CONSTRAINT "PK_9de2f926022cdb17d4649de1a16" PRIMARY KEY ("userId", "movieinfoId"))`);
        await queryRunner.query(`CREATE TABLE "movie_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "movie_info_type_enum" NOT NULL, "producer" character varying, "episode" integer, "status" "movie_info_status_enum" NOT NULL, "synopsis" character varying, "backgroundInfo" character varying, "duration" integer, "released_date" character varying, "movieId" uuid, CONSTRAINT "REL_47e54c56b1a7b93a6b5e1f6587" UNIQUE ("movieId"), CONSTRAINT "PK_f263ca2fcf978d138a6dd163a7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "photo" character varying, "creatorId" uuid NOT NULL, CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title"), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genre" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name"), CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genres_movies" ("genreId" uuid NOT NULL, "movieId" uuid NOT NULL, CONSTRAINT "PK_6f0b2c7572b5ac9fefc7a043130" PRIMARY KEY ("genreId", "movieId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_07db9d2ece40a24ee3bffa4a6a" ON "genres_movies" ("genreId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1b7599300cde8961f46cef52b0" ON "genres_movies" ("movieId") `);
        await queryRunner.query(`ALTER TABLE "rating_movies" ADD CONSTRAINT "FK_25efa41d4a2410df89c92b436f4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating_movies" ADD CONSTRAINT "FK_a059e789ae41b5616401ab11f95" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_characters" ADD CONSTRAINT "FK_1f5ccfd62ce88d8413a2cb05118" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_characters" ADD CONSTRAINT "FK_825fe0036a292bf009d93422947" FOREIGN KEY ("movieinfoId") REFERENCES "movie_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_info" ADD CONSTRAINT "FK_47e54c56b1a7b93a6b5e1f6587b" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "FK_b55916de756e46290d52c70fc04" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "genres_movies" ADD CONSTRAINT "FK_07db9d2ece40a24ee3bffa4a6aa" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "genres_movies" ADD CONSTRAINT "FK_1b7599300cde8961f46cef52b09" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "genres_movies" DROP CONSTRAINT "FK_1b7599300cde8961f46cef52b09"`);
        await queryRunner.query(`ALTER TABLE "genres_movies" DROP CONSTRAINT "FK_07db9d2ece40a24ee3bffa4a6aa"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "FK_b55916de756e46290d52c70fc04"`);
        await queryRunner.query(`ALTER TABLE "movie_info" DROP CONSTRAINT "FK_47e54c56b1a7b93a6b5e1f6587b"`);
        await queryRunner.query(`ALTER TABLE "movie_characters" DROP CONSTRAINT "FK_825fe0036a292bf009d93422947"`);
        await queryRunner.query(`ALTER TABLE "movie_characters" DROP CONSTRAINT "FK_1f5ccfd62ce88d8413a2cb05118"`);
        await queryRunner.query(`ALTER TABLE "rating_movies" DROP CONSTRAINT "FK_a059e789ae41b5616401ab11f95"`);
        await queryRunner.query(`ALTER TABLE "rating_movies" DROP CONSTRAINT "FK_25efa41d4a2410df89c92b436f4"`);
        await queryRunner.query(`DROP INDEX "IDX_1b7599300cde8961f46cef52b0"`);
        await queryRunner.query(`DROP INDEX "IDX_07db9d2ece40a24ee3bffa4a6a"`);
        await queryRunner.query(`DROP TABLE "genres_movies"`);
        await queryRunner.query(`DROP TABLE "genre"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "movie_info"`);
        await queryRunner.query(`DROP TABLE "movie_characters"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "rating_movies"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`);
        await queryRunner.query(`DROP TYPE "movie_info_type_enum"`);
        await queryRunner.query(`DROP TYPE "movie_info_status_enum"`);
    }

}
