import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyLesson1739167110979 implements MigrationInterface {
    name = 'ModifyLesson1739167110979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`lesson\` DROP COLUMN \`end_time\``);
        await queryRunner.query(`ALTER TABLE \`lesson\` ADD \`end_time\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`lesson\` DROP COLUMN \`end_time\``);
        await queryRunner.query(`ALTER TABLE \`lesson\` ADD \`end_time\` varchar(255) NOT NULL`);
    }

}
