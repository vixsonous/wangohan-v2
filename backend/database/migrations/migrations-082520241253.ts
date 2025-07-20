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
    .addColumn("user_image", "varchar(100)", (col) => col.notNull())
    .addColumn("user_agreement", "integer", (col) => col.notNull())
    .addColumn("user_gender", "varchar(2)", (col) => col.notNull())
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

  await db.schema
    .createTable("pets_table")
    .addColumn("pet_id", "serial", (col) => col.primaryKey())
    .addColumn("pet_name", "varchar(100)", (col) => col.notNull())
    .addColumn("pet_birthdate", "timestamp", (col) => col.notNull())
    .addColumn("pet_breed", "varchar(100)", (col) => col.notNull())
    .addColumn("pet_image", "varchar(100)", (col) => col.notNull())
    .addColumn("user_id", "serial", (col) => col.references("users_table.user_id").onDelete('cascade').notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("allergies_table")
    .addColumn("allergy_id", "serial", (col) => col.primaryKey())
    .addColumn("allergy_name", "varchar(100)", (col) => col.notNull())
    .addColumn("allergy_ingredient", "timestamp", (col) => col.notNull())
    .addColumn("pet_id", "serial", (col) => col.references("pets_table.pet_id").onDelete('cascade').notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
  
  await db.schema
    .createTable("recipes_table")
    .addColumn("recipe_id", "serial", (col) => col.primaryKey())
    .addColumn("recipe_name", "varchar(100)", (col) => col.notNull())
    .addColumn("recipe_age_tag", "varchar(100)", (col) => col.notNull())
    .addColumn("recipe_size_tag", "varchar(100)", (col) => col.notNull())
    .addColumn("recipe_event_tag", "varchar(100)", (col) => col.notNull())
    .addColumn("recipe_category", "varchar(100)", (col) => col.notNull())
    .addColumn("total_likes", "integer", (col) => col.notNull())
    .addColumn("total_favourites", "integer", (col) => col.notNull())
    .addColumn("user_id", "serial", (col) => col.references("users_table.user_id").onDelete('cascade').notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("recipe_comments_table")
    .addColumn("recipe_comment_id", "serial", (col) => col.primaryKey())
    .addColumn("recipe_comment_title", "varchar(100)", (col) => col.notNull())
    .addColumn("recipe_comment_subtext", "varchar(100)", (col) => col.notNull())
    .addColumn("recipe_comment_rating", "integer", (col) => col.notNull())
    .addColumn("user_id", "serial", (col) => col.references("users_table.user_id").onDelete('cascade').notNull())
    .addColumn("recipe_id", "serial", (col) => col.references("recipes_table.recipe_id").onDelete('cascade').notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("recipe_images_table")
    .addColumn("recipe_image_id", "serial", (col) => col.primaryKey())
    .addColumn("recipe_image_title", "varchar(100)", (col) => col.notNull())
    .addColumn("recipe_image_subtext", "varchar(100)", (col) => col.notNull())
    .addColumn("recipe_image", "varchar(255)", (col) => col.notNull())
    .addColumn("recipe_id", "serial", (col) => col.references("recipes_table.recipe_id").onDelete('cascade').notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("recipe_instructions_table")
    .addColumn("recipe_instruction_id", "serial", (col) => col.primaryKey())
    .addColumn("recipe_instruction_text", "varchar(100)", (col) => col.notNull())
    .addColumn("recipe_id", "serial", (col) => col.references("recipes_table.recipe_id").onDelete('cascade').notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("recipe_ingredients_table")
    .addColumn("recipe_ingredient_id", "serial", (col) => col.primaryKey())
    .addColumn("recipe_ingredient_name", "varchar(100)", (col) => col.notNull())
    .addColumn("recipe_id", "serial", (col) => col.references("recipes_table.recipe_id").onDelete('cascade').notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("favourites_table")
    .addColumn("favourite_id", "serial", (col) => col.primaryKey())
    .addColumn("recipe_id", "serial", (col) => col.references("recipes_table.recipe_id").onDelete('cascade').notNull())
    .addColumn("user_id", "serial", (col) => col.references("users_table.user_id").onDelete('cascade').notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("likes_table")
    .addColumn("like_id", "serial", (col) => col.primaryKey())
    .addColumn("recipe_id", "serial", (col) => col.references("recipes_table.recipe_id").onDelete('cascade').notNull())
    .addColumn("user_id", "serial", (col) => col.references("users_table.user_id").onDelete('cascade').notNull())
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users_table").execute();
  await db.schema.dropTable("user_details_table").execute();
  await db.schema.dropTable("pets_table").execute();
  await db.schema.dropTable("allergies_table").execute();
  await db.schema.dropTable("recipes_table").execute();
  await db.schema.dropTable("recipe_comments_table").execute();
  await db.schema.dropTable("recipe_images_table").execute();
  await db.schema.dropTable("recipe_instructions_table").execute();
  await db.schema.dropTable("recipe_ingredients_table").execute();
  await db.schema.dropTable("likes_table").execute();
  await db.schema.dropTable("favourites_table").execute();
}