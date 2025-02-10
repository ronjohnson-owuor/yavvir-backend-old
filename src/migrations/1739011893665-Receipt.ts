import { MigrationInterface, QueryRunner } from "typeorm";

export class Receipt1739011893665 implements MigrationInterface {
    name = 'Receipt1739011893665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`receipt\` ADD \`paid\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`receipt\` DROP COLUMN \`paid\``);
    }

}
