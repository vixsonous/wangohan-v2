import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("users_table")
    .addColumn("user_uuid","uuid", col => col.notNull().defaultTo(sql`gen_random_uuid()`))
    .execute();

  await db.schema.alterTable("recipes_table")
    .addColumn("recipe_uuid","uuid", col => col.notNull().defaultTo(sql`gen_random_uuid()`))
    .execute();
}