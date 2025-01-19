import { MigrationInterface, QueryRunner } from "typeorm";

export class Tokenmigration1737274645266 implements MigrationInterface {
    name = 'Tokenmigration1737274645266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userid\` int NOT NULL, \`token_value\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`token\``);
    }

}
