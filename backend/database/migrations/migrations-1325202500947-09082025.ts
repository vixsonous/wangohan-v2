import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("notifications_table")
    .addUniqueConstraint('notification_unique_constraint', ['user_id', 'recipe_id', 'type'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("notifications_table")
    .dropConstraint("notification_unique_constraint")
    .execute();
}