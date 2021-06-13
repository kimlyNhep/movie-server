import {MigrationInterface, QueryRunner} from "typeorm";

export class movie1623262905930 implements MigrationInterface {
    name = 'movie1623262905930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rating_movies" ("ratedPoint" integer NOT NULL, "userId" uuid NOT NULL, "movieId" uuid NOT NULL, CONSTRAINT "PK_6d6ae29a041cfa3e5c71e8e60c3" PRIMARY KEY ("userId", "movieId"))`);
        await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('Admin', 'Member')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text, "username" text NOT NULL, "role" "user_role_enum" NOT NULL, "password" text NOT NULL, "photo" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" uuid, "movieId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genre" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name"), CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "movie_info_type_enum" AS ENUM('Tv', 'Movie')`);
        await queryRunner.query(`CREATE TYPE "movie_info_status_enum" AS ENUM('Completed', 'Ongoing')`);
        await queryRunner.query(`CREATE TABLE "movie_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "movie_info_type_enum" NOT NULL, "producer" character varying, "episode" integer, "status" "movie_info_status_enum" NOT NULL, "synopsis" character varying, "backgroundInfo" character varying, "duration" integer, "released_date" character varying, "movieId" uuid, CONSTRAINT "REL_47e54c56b1a7b93a6b5e1f6587" UNIQUE ("movieId"), CONSTRAINT "PK_f263ca2fcf978d138a6dd163a7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "photo" character varying, "creatorId" uuid NOT NULL, CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title"), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie_characters" ("role" character varying, "characterId" uuid NOT NULL, "movieId" uuid NOT NULL, CONSTRAINT "PK_204f45c85ee21e15f7d93e7de27" PRIMARY KEY ("characterId", "movieId"))`);
        await queryRunner.query(`CREATE TABLE "character" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "photo" character varying NOT NULL, CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genres_movies" ("genreId" uuid NOT NULL, "movieId" uuid NOT NULL, CONSTRAINT "PK_6f0b2c7572b5ac9fefc7a043130" PRIMARY KEY ("genreId", "movieId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_07db9d2ece40a24ee3bffa4a6a" ON "genres_movies" ("genreId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1b7599300cde8961f46cef52b0" ON "genres_movies" ("movieId") `);
        await queryRunner.query(`ALTER TABLE "rating_movies" ADD CONSTRAINT "FK_25efa41d4a2410df89c92b436f4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating_movies" ADD CONSTRAINT "FK_a059e789ae41b5616401ab11f95" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_aea4918c888422550a85e257894" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_info" ADD CONSTRAINT "FK_47e54c56b1a7b93a6b5e1f6587b" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "FK_b55916de756e46290d52c70fc04" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_characters" ADD CONSTRAINT "FK_0226a4fdd43905998216f65b010" FOREIGN KEY ("characterId") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_characters" ADD CONSTRAINT "FK_15168726b3382198376fef3910c" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "genres_movies" ADD CONSTRAINT "FK_07db9d2ece40a24ee3bffa4a6aa" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "genres_movies" ADD CONSTRAINT "FK_1b7599300cde8961f46cef52b09" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "genres_movies" DROP CONSTRAINT "FK_1b7599300cde8961f46cef52b09"`);
        await queryRunner.query(`ALTER TABLE "genres_movies" DROP CONSTRAINT "FK_07db9d2ece40a24ee3bffa4a6aa"`);
        await queryRunner.query(`ALTER TABLE "movie_characters" DROP CONSTRAINT "FK_15168726b3382198376fef3910c"`);
        await queryRunner.query(`ALTER TABLE "movie_characters" DROP CONSTRAINT "FK_0226a4fdd43905998216f65b010"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "FK_b55916de756e46290d52c70fc04"`);
        await queryRunner.query(`ALTER TABLE "movie_info" DROP CONSTRAINT "FK_47e54c56b1a7b93a6b5e1f6587b"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_aea4918c888422550a85e257894"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "rating_movies" DROP CONSTRAINT "FK_a059e789ae41b5616401ab11f95"`);
        await queryRunner.query(`ALTER TABLE "rating_movies" DROP CONSTRAINT "FK_25efa41d4a2410df89c92b436f4"`);
        await queryRunner.query(`DROP INDEX "IDX_1b7599300cde8961f46cef52b0"`);
        await queryRunner.query(`DROP INDEX "IDX_07db9d2ece40a24ee3bffa4a6a"`);
        await queryRunner.query(`DROP TABLE "genres_movies"`);
        await queryRunner.query(`DROP TABLE "character"`);
        await queryRunner.query(`DROP TABLE "movie_characters"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "movie_info"`);
        await queryRunner.query(`DROP TYPE "movie_info_status_enum"`);
        await queryRunner.query(`DROP TYPE "movie_info_type_enum"`);
        await queryRunner.query(`DROP TABLE "genre"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`);
        await queryRunner.query(`DROP TABLE "rating_movies"`);
    }

}
