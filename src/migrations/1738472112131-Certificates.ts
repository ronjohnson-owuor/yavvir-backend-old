import { MigrationInterface, QueryRunner } from "typeorm";

export class Certificates1738472112131 implements MigrationInterface {
    name = 'Certificates1738472112131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`certificates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userid\` int NOT NULL, \`certificate_path\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`teacherdetails\` DROP COLUMN \`subjects\``);
        await queryRunner.query(`ALTER TABLE \`teacherdetails\` ADD \`subjects\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teacherdetails\` DROP COLUMN \`subjects\``);
        await queryRunner.query(`ALTER TABLE \`teacherdetails\` ADD \`subjects\` int NULL`);
        await queryRunner.query(`DROP TABLE \`certificates\``);
    }

}
