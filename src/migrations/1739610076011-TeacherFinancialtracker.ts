import { MigrationInterface, QueryRunner } from "typeorm";

export class TeacherFinancialtracker1739610076011 implements MigrationInterface {
    name = 'TeacherFinancialtracker1739610076011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`teacher_financetracker\` (\`id\` int NOT NULL AUTO_INCREMENT, \`teacher_id\` int NOT NULL, \`status\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`teacher_financetracker\``);
    }

}
