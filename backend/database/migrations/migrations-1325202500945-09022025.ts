import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("likes_table")
    .addUniqueConstraint('user_recipe_unique_constraint', ['user_id', 'recipe_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("likes_table")
    .dropConstraint("user_recipe_unique_constraint")
    .execute();
}