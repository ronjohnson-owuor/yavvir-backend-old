import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyLesson1739165139142 implements MigrationInterface {
    name = 'ModifyLesson1739165139142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`lesson\` ADD \`inprogress\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`lesson\` ADD \`end_time\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`lesson\` DROP COLUMN \`end_time\``);
        await queryRunner.query(`ALTER TABLE \`lesson\` DROP COLUMN \`inprogress\``);
    }

}
