import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("recipes_table")
    .addColumn("is_published", "boolean", col => col.notNull().defaultTo(false))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("recipes_table")
    .dropColumn("is_published")
    .execute();
}