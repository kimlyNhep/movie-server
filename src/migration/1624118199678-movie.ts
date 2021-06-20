import {MigrationInterface, QueryRunner} from "typeorm";

export class movie1624118199678 implements MigrationInterface {
    name = 'movie1624118199678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "rank" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "rank"`);
    }

}
