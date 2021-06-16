import {MigrationInterface, QueryRunner} from "typeorm";

export class movie1623690974166 implements MigrationInterface {
    name = 'movie1623690974166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movie_state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "watching" integer NOT NULL, "planToWatch" integer NOT NULL, "completed" integer NOT NULL, "drop" integer NOT NULL, "userId" uuid NOT NULL, "movieId" uuid, CONSTRAINT "REL_54ae12c7f2813b6aba9294fea9" UNIQUE ("userId"), CONSTRAINT "PK_88cb06497f5f8278a93b5526e44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "FK_54ae12c7f2813b6aba9294fea91" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "FK_26e9b61de5c82c98d3eca9b1fb9" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "FK_26e9b61de5c82c98d3eca9b1fb9"`);
        await queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "FK_54ae12c7f2813b6aba9294fea91"`);
        await queryRunner.query(`DROP TABLE "movie_state"`);
    }

}
