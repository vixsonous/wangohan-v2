import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("recipe_instructions_table")
    .addColumn("recipe_instruction_order","smallint", col => col.notNull().defaultTo(0))
    .execute();

  await db.schema.alterTable("recipe_ingredients_table")
    .addColumn("recipe_ingredient_order","smallint", col => col.notNull().defaultTo(0))
    .execute();

  await db.schema.alterTable("recipe_images_table")
    .addColumn("recipe_image_order", "smallint", col => col.notNull().defaultTo(0))
    .execute();
}