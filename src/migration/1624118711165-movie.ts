import {MigrationInterface, QueryRunner} from "typeorm";

export class movie1624118711165 implements MigrationInterface {
    name = 'movie1624118711165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "rank"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "rank" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "rank"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "rank" integer NOT NULL DEFAULT '0'`);
    }

}
