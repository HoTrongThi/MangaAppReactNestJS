import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class CreateAdminUser1709123456789 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        
        await queryRunner.query(`
            INSERT INTO users (username, email, password, role, created_at, updated_at)
            VALUES ('admin', 'admin@example.com', '${hashedPassword}', 'admin', NOW(), NOW())
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM users WHERE email = 'admin@example.com'
        `);
    }
} 