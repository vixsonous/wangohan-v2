import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("recipes_table")
    .addColumn("is_deleted", "boolean", col => col.notNull().defaultTo(false))
    .execute();

  await db.schema.alterTable("users_table")
    .addColumn("is_inactive", "boolean", col => col.notNull().defaultTo(false))
    .execute();

  await db.schema.alterTable("blog_columns_table")
    .addColumn("is_deleted", "boolean", col => col.notNull().defaultTo(false))
    .execute();
}