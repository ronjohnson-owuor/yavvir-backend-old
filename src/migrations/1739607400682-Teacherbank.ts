import { MigrationInterface, QueryRunner } from "typeorm";

export class Teacherbank1739607400682 implements MigrationInterface {
    name = 'Teacherbank1739607400682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`teacherbank\` (\`id\` int NOT NULL AUTO_INCREMENT, \`teacher_id\` int NOT NULL, \`amount\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`teacherbank\``);
    }

}
