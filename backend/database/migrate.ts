import { Migration, MigrationProvider, Migrator } from "kysely";
import { fileURLToPath } from "url";
import * as path from 'path';
import { promises as fs } from 'fs';
import { db } from "./database";

class ESMFileMigrationProvider implements MigrationProvider {
  constructor(private relativePath: string) { }

  async getMigrations(): Promise<Record<string, Migration>> {
      const migrations: Record<string, Migration> = { };
      const __dirname = fileURLToPath(new URL(".", import.meta.url));
      const resolvedPath = path.resolve(__dirname, this.relativePath);
      const files = await fs.readdir(resolvedPath);
      for (const fileName of files) {
          if (!fileName.endsWith(".ts")) {
              continue;
          }

          const importPath = path.join(resolvedPath, fileName).replaceAll("\\", "/");
          const migration = await import("file://" + importPath);
          const migrationKey = fileName.substring(0, fileName.lastIndexOf("."));
          migrations[migrationKey] = migration;
      }

      return migrations;
  }
}

async function migrateToLatest() {
  const migrator = new Migrator({
    db: db,
    provider: new ESMFileMigrationProvider("migrations")
  });

  const {error, results} = await migrator.migrateToLatest();

  results?.forEach(it => {
    if(it.status === 'Success') {
      console.log(`Migration: ${it.migrationName} was excecuted successfuly!`);
    } else if(it.status === "Error") {
      console.error(`Migration: ${it.migrationName} failed to execute`);
    }
  })

  if(error) {
    console.log('Failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();