import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1738601259664 implements MigrationInterface {
    name = 'InitialMigration1738601259664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`picture\` varchar(255) NULL, \`role\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teacherdetails\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`certificates\` int NULL, \`ground_tutor\` tinyint NOT NULL DEFAULT 0, \`location\` varchar(255) NULL, \`school\` varchar(255) NULL, \`subjects\` varchar(255) NULL, \`bio\` varchar(255) NULL, \`extra_info\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`emailcode\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`code\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userid\` int NOT NULL, \`token_value\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`certificates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userid\` int NOT NULL, \`certificate_path\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`certificates\``);
        await queryRunner.query(`DROP TABLE \`token\``);
        await queryRunner.query(`DROP TABLE \`emailcode\``);
        await queryRunner.query(`DROP TABLE \`teacherdetails\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
