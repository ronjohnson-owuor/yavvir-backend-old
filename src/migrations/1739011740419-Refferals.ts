import { MigrationInterface, QueryRunner } from "typeorm";

export class Refferals1739011740419 implements MigrationInterface {
    name = 'Refferals1739011740419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`receipt\` (\`id\` int NOT NULL AUTO_INCREMENT, \`customer_id\` int NOT NULL, \`receipt\` varchar(255) NOT NULL, \`refference\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`receipt\``);
    }

}
