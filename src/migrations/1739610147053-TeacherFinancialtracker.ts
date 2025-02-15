import { MigrationInterface, QueryRunner } from "typeorm";

export class TeacherFinancialtracker1739610147053 implements MigrationInterface {
    name = 'TeacherFinancialtracker1739610147053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teacher_financetracker\` ADD \`amount\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teacher_financetracker\` DROP COLUMN \`amount\``);
    }

}
