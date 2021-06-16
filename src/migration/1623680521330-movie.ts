import {MigrationInterface, QueryRunner} from "typeorm";

export class movie1623680521330 implements MigrationInterface {
    name = 'movie1623680521330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" RENAME COLUMN "ratedPoint" TO "point"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" RENAME COLUMN "point" TO "ratedPoint"`);
    }

}
