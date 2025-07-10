import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users_table")
    .addColumn("user_id", "serial", (col) => col.primaryKey())
    .addColumn("google_id", "varchar(100)")
    .addColumn("email", "varchar(100)")
    .addColumn("password", "varchar(255)")
    .addColumn("user_lvl", "integer", (col) => col.notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("user_details_table")
    .addColumn("user_detail_id", "serial", (col) => col.primaryKey())
    .addColumn("user_first_name", "varchar(50)", (col) => col.notNull())
    .addColumn("user_last_name", "varchar(50)", (col) => col.notNull())
    .addColumn("user_codename", "varchar(50)", (col) => col.notNull())
    .addColumn("user_image", "varchar(255)", (col) => col.notNull())
    .addColumn("user_agreement", "integer", (col) => col.notNull())
    .addColumn("user_gender", "varchar(20)", (col) => col.notNull())
    .addColumn("user_birthdate", "timestamp", (col) => col.notNull())
    .addColumn("user_occupation", "varchar(50)", (col) => col.notNull())
    .addColumn("user_id", "serial", (col) => col.references('users_table.user_id').onDelete('cascade').notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}