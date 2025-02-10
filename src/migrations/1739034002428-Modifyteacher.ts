import { MigrationInterface, QueryRunner } from "typeorm";

export class Modifyteacher1739034002428 implements MigrationInterface {
    name = 'Modifyteacher1739034002428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teacherdetails\` ADD \`premium\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teacherdetails\` DROP COLUMN \`premium\``);
    }

}
