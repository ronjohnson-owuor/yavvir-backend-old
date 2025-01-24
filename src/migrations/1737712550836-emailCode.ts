import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailCode1737712550836 implements MigrationInterface {
    name = 'EmailCode1737712550836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`emailcode\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`code\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`emailcode\``);
    }

}
