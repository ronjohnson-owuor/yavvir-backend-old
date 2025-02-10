import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLessonPrice1739181379234 implements MigrationInterface {
    name = 'CreateLessonPrice1739181379234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`lessonprice\` (\`id\` int NOT NULL AUTO_INCREMENT, \`lesson_uuid\` varchar(255) NOT NULL, \`lesson_price\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`lessonprice\``);
    }

}
