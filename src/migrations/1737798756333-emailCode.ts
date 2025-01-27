import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailCode1737798756333 implements MigrationInterface {
    name = 'EmailCode1737798756333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`emailcode\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`code\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`emailcode\``);
    }

}
