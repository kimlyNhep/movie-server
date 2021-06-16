import {MigrationInterface, QueryRunner} from "typeorm";

export class movie1623611202012 implements MigrationInterface {
    name = 'movie1623611202012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "ratedPoint"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "ratedPoint" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "ratedPoint"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "ratedPoint" integer`);
    }

}
