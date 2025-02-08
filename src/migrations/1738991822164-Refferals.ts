import { MigrationInterface, QueryRunner } from "typeorm";

export class Refferals1738991822164 implements MigrationInterface {
    name = 'Refferals1738991822164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`refferals\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userid\` int NOT NULL, \`ref_value\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`refferals\``);
    }

}
