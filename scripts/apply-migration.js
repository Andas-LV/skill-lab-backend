const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function applyMigration() {
	try {
		const migrationPath = path.join(
			__dirname,
			'../prisma/migrations/20250120000000_add_basket_and_favorites/migration.sql',
		);
		const sql = fs.readFileSync(migrationPath, 'utf8');

		console.log('Applying migration...');

		// Выполняем весь SQL как одну транзакцию
		await prisma.$transaction(async (tx) => {
			// Разбиваем на команды и выполняем каждую
			const commands = sql
				.split(';')
				.map((cmd) => cmd.trim())
				.filter((cmd) => cmd.length > 0 && !cmd.startsWith('--'));

			for (const command of commands) {
				if (command) {
					await tx.$executeRawUnsafe(command);
				}
			}
		});

		console.log('Migration applied successfully!');
	} catch (error) {
		console.error('Error applying migration:', error.message);
		if (error.code === 'P2010') {
			console.log(
				'Note: Some tables might already exist. This is normal if migration was partially applied.',
			);
		}
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

applyMigration();

