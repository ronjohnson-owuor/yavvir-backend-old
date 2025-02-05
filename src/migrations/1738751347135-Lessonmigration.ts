import { MigrationInterface, QueryRunner } from "typeorm";

export class Lessonmigration1738751347135 implements MigrationInterface {
    name = 'Lessonmigration1738751347135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`lesson\` (\`id\` int NOT NULL AUTO_INCREMENT, \`lesson_name\` varchar(255) NOT NULL, \`lesson_uuid\` varchar(255) NOT NULL, \`duration\` int NOT NULL, \`creator\` int NOT NULL, \`start_time\` datetime NOT NULL, \`expired\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`lesson\``);
    }

}
