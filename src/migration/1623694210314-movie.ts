import {MigrationInterface, QueryRunner} from "typeorm";

export class movie1623694210314 implements MigrationInterface {
    name = 'movie1623694210314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "PK_88cb06497f5f8278a93b5526e44"`);
        await queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "PK_edd3bf97a671ccced5e631b7723" PRIMARY KEY ("id", "userId", "movieId")`);
        await queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "FK_54ae12c7f2813b6aba9294fea91"`);
        await queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "FK_26e9b61de5c82c98d3eca9b1fb9"`);
        await queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "REL_54ae12c7f2813b6aba9294fea9"`);
        await queryRunner.query(`ALTER TABLE "movie_state" ALTER COLUMN "movieId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "FK_54ae12c7f2813b6aba9294fea91" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "FK_26e9b61de5c82c98d3eca9b1fb9" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "FK_26e9b61de5c82c98d3eca9b1fb9"`);
        await queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "FK_54ae12c7f2813b6aba9294fea91"`);
        await queryRunner.query(`ALTER TABLE "movie_state" ALTER COLUMN "movieId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "REL_54ae12c7f2813b6aba9294fea9" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "FK_26e9b61de5c82c98d3eca9b1fb9" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "FK_54ae12c7f2813b6aba9294fea91" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "PK_edd3bf97a671ccced5e631b7723"`);
        await queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "PK_88cb06497f5f8278a93b5526e44" PRIMARY KEY ("id")`);
    }

}
