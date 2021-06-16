import {MigrationInterface, QueryRunner} from "typeorm";

export class movie1623694387337 implements MigrationInterface {
    name = 'movie1623694387337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "PK_edd3bf97a671ccced5e631b7723"`);
        await queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "PK_a01cda37421688720e7ea7406c8" PRIMARY KEY ("userId", "movieId")`);
        await queryRunner.query(`ALTER TABLE "movie_state" DROP COLUMN "id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_state" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "movie_state" DROP CONSTRAINT "PK_a01cda37421688720e7ea7406c8"`);
        await queryRunner.query(`ALTER TABLE "movie_state" ADD CONSTRAINT "PK_edd3bf97a671ccced5e631b7723" PRIMARY KEY ("id", "userId", "movieId")`);
    }

}
