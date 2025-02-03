import { MigrationInterface, QueryRunner } from "typeorm";

export class Certificates1738521183650 implements MigrationInterface {
    name = 'Certificates1738521183650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`certificates\` ADD \`title\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`certificates\` DROP COLUMN \`title\``);
    }

}
