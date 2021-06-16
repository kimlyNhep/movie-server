import {MigrationInterface, QueryRunner} from "typeorm";

export class movie1623603149304 implements MigrationInterface {
    name = 'movie1623603149304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "ratedPoint" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "ratedPoint"`);
    }

}
