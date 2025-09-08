import {Kysely, sql} from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("notifications_table")
    .dropColumn("notification_content")
    .dropColumn("created_at")
    .dropColumn("recipe_image")
    .dropColumn("recipe_owner_id")
    .addColumn("user_image", "varchar(255)")
    .addColumn("user_codename", "varchar(255)")
    .addColumn("recipe_name", "varchar(255)", col => col.notNull())
    .addColumn("notification_date", "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("likes_table")
    .dropConstraint("user_recipe_unique_constraint")
    .execute();
}