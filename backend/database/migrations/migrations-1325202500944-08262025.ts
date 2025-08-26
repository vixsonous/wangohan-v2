import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("recipe_instructions_table")
    .addForeignKeyConstraint("recipe_table_fk", ["recipe_id"], "recipes_table", ["recipe_id"], builder => builder.onDelete("cascade"))
    .execute();

  await db.schema.alterTable("recipe_ingredients_table")
    .addForeignKeyConstraint("recipe_table_fk", ["recipe_id"], "recipes_table", ["recipe_id"], builder => builder.onDelete("cascade"))
    .execute();

  await db.schema.alterTable("recipe_images_table")
    .addForeignKeyConstraint("recipe_table_fk", ["recipe_id"], "recipes_table", ["recipe_id"], builder => builder.onDelete("cascade"))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("recipe_instructions_table")
    .dropConstraint("recipe_table_fk")
    .execute();

  await db.schema.alterTable("recipe_ingredients_table")
    .dropConstraint("recipe_table_fk")
    .execute();

  await db.schema.alterTable("recipe_images_table")
    .dropConstraint("recipe_table_fk")
    .execute();
}