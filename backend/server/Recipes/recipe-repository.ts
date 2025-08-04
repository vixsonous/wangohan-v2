import z from "zod";
import { db } from "../../database/database";
import { RecipeIngredientInsert, RecipeInsert, RecipeInstructionInsert } from "../../database/types";
import { log } from "../utils/log";
import { PostRecipeSchema, RecipeDetailsDisplay, RecipeDisplayDetails } from "./recipe-types";
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';

export class RecipeRepository {
  private static FRONT_PAGE_RECIPE_QUERY_LIMIT = 10;

  private static START_PAGE = 0;
  static async getRecipeDetails(recipe_id: number) {

  }

  static async getPopularRecipes(
    page: number = this.START_PAGE, 
    limit: number = this.FRONT_PAGE_RECIPE_QUERY_LIMIT
  ): Promise<Array<RecipeDisplayDetails>> {
    try {

      const OFFSET = page * limit;
      const recipes: Array<RecipeDisplayDetails> = await db
        .selectFrom("recipes_table")
        .select((eb) => [
          "recipe_name",
          "recipe_id",
          "recipe_category",
          "recipe_age_tag",
          "recipe_event_tag",
          "recipe_size_tag",
          "recipe_description",
          "user_id",
          "recipes_table.created_at",
          "total_likes",
          "total_views",
          jsonArrayFrom(
            eb.selectFrom("recipe_images_table")
              .select([
                "recipe_image_id",
                "recipe_image_title",
                "recipe_image_subtext",
                "recipe_image",
                "recipe_id",
              ])
              .whereRef("recipe_images_table.recipe_id","=","recipes_table.recipe_id")
          ).as("recipe_images"),
          jsonObjectFrom(
            eb.selectFrom("recipe_comments_table")
            .select(({ fn, val, ref }) => [
              fn
                .count<number>("recipe_comment_id")
                .filterWhereRef("recipe_id", "=", "recipes_table.recipe_id")
                .as("total_rating"),
              fn
                .avg<number>("recipe_comment_rating")
                .filterWhereRef("recipe_id", "=", "recipes_table.recipe_id")
                .as("avg_rating"),
            ])
          ).as("recipe_rating_data")
        ])
        .orderBy("total_views", "desc")
        .limit(limit)
        .offset(OFFSET)
        .execute();

      return recipes;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async getWeeklyRecipes(): Promise<Array<RecipeDisplayDetails>> {
    try {
      const recipes: Array<RecipeDisplayDetails> = await db
        .selectFrom("recipes_table")
        .select(eb => [
          "recipe_name",
          "recipe_id",
          "recipe_category",
          "recipe_age_tag",
          "recipe_event_tag",
          "recipe_size_tag",
          "recipe_description",
          "user_id",
          "created_at",
          "total_likes",
          "total_views",
          jsonArrayFrom(
            eb.selectFrom("recipe_images_table")
              .select([
                "recipe_image_id",
                "recipe_image_title",
                "recipe_image_subtext",
                "recipe_image",
                "recipe_id",
              ])
              .whereRef("recipe_images_table.recipe_id","=","recipes_table.recipe_id")
          ).as("recipe_images"),
          jsonObjectFrom(
            eb.selectFrom("recipe_comments_table")
            .select(({ fn, val, ref }) => [
              fn
                .count<number>("recipe_comment_id")
                .filterWhereRef("recipe_id", "=", "recipes_table.recipe_id")
                .as("total_rating"),
              fn
                .avg<number>("recipe_comment_rating")
                .filterWhereRef("recipe_id", "=", "recipes_table.recipe_id")
                .as("avg_rating"),
            ])
          ).as("recipe_rating_data")
        ])
        .where("created_at", ">=", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .orderBy("created_at", "desc")
        .limit(this.FRONT_PAGE_RECIPE_QUERY_LIMIT)
        .execute();

      return recipes;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  static async getRecipe(recipe_id: number, recipe_name: string): Promise<RecipeDetailsDisplay | undefined> {
    try {
      const recipe: RecipeDetailsDisplay = await db
        .selectFrom("recipes_table")
        .select(eb => [
          "recipe_name",
          "recipe_id",
          "recipe_category",
          "recipe_age_tag",
          "recipe_event_tag",
          "recipe_size_tag",
          "recipe_description",
          "user_id",
          "created_at",
          "total_likes",
          "total_views",
          jsonArrayFrom(
            eb.selectFrom("recipe_instructions_table")
              .select([
                "recipe_instructions_text",
              ]).whereRef("recipe_instructions_table.recipe_id","=","recipes_table.recipe_id")
          ).as("recipe_instructions"),
          jsonArrayFrom(
            eb.selectFrom("recipe_ingredients_table")
              .select([
                "recipe_ingredients_name",
                "recipe_ingredients_amount",
              ]).whereRef("recipe_ingredients_table.recipe_id","=","recipes_table.recipe_id")
          ).as("recipe_ingredients"),
          jsonArrayFrom(
            eb.selectFrom("recipe_images_table")
              .select([
                "recipe_image_id",
                "recipe_image_title",
                "recipe_image_subtext",
                "recipe_image",
                "recipe_id",
              ])
              .whereRef("recipe_images_table.recipe_id","=","recipes_table.recipe_id")
          ).as("recipe_images"),
          jsonObjectFrom(
            eb.selectFrom("recipe_comments_table")
            .select(({ fn, val, ref }) => [
              fn
                .count<number>("recipe_comment_id")
                .filterWhereRef("recipe_id", "=", "recipes_table.recipe_id")
                .as("total_rating"),
              fn
                .avg<number>("recipe_comment_rating")
                .filterWhereRef("recipe_id", "=", "recipes_table.recipe_id")
                .as("avg_rating"),
            ])
          ).as("recipe_rating_data"),
          jsonArrayFrom(
            eb.selectFrom("recipe_comments_table")
              .select(rc => [
                "recipe_comment_subtext",
                "recipe_comment_rating",
                "recipe_comments_table.created_at",
                jsonObjectFrom(
                  rc.selectFrom("user_details_table")
                    .select([
                      "user_id",
                      "user_image",
                      "user_codename"
                    ])
                    .whereRef("recipe_comments_table.user_id", "=", "user_details_table.user_id")
                ).as("user")
              ])
              .whereRef("recipe_comments_table.recipe_id","=","recipes_table.recipe_id")
          ).as("recipe_comments")
        ])
        .where(eb => eb.and({
          recipe_id: recipe_id,
          recipe_name: recipe_name
        }))
        .executeTakeFirstOrThrow();

      return recipe;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  static async insertRecipe(recipe: z.infer<typeof PostRecipeSchema>): Promise<boolean> {
    const trx = await db.startTransaction().execute();
    try {

      const recipe_age_tag = recipe.checkbox_age?.filter(a => a !== undefined && a !== 'false').join(",") || "";
      const recipe_size_tag = recipe.checkbox_size?.filter(s => s !== undefined && s !== 'false').join(",") || "";
      const recipe_event_tag = recipe.checkbox_event?.filter(e => e !== undefined && e !== 'false').join(",") || "";

      const newRecipe = {
        recipe_name: recipe.recipe_title,
        recipe_description: recipe.recipe_description,
        recipe_category: "",
        recipe_age_tag,
        recipe_event_tag,
        recipe_size_tag,
        user_id: recipe.user_id,
        total_favourites: 0,
        total_likes: 0,
        total_views: 0,
        updated_at: new Date(),
        created_at: new Date()
      } satisfies RecipeInsert;

      const {recipe_id} = await trx.insertInto("recipes_table")
        .values(newRecipe)
        .returning("recipe_id")
        .executeTakeFirstOrThrow();
      
      const newInstructions: RecipeInstructionInsert[] = recipe.recipe_instructions.map( (i, idx) => ({
        recipe_instruction_order: idx,
        recipe_instructions_text: i.recipe_instruction,
        recipe_id,
        updated_at: new Date(),
        created_at: new Date(),
      }));

      await trx.insertInto("recipe_instructions_table")
        .values(newInstructions)
        .execute();

      const newIngredients: RecipeIngredientInsert[] = recipe.recipe_ingredients.map( (i , idx) => ({
        recipe_ingredient_order: idx,
        recipe_ingredients_amount: i.recipe_amount,
        recipe_ingredients_name: i.recipe_ingredient,
        recipe_id,
        updated_at: new Date(),
        created_at: new Date()
      }));

      await trx.insertInto("recipe_ingredients_table")
        .values(newIngredients)
        .execute();

      
      console.log("Successfully inserted!");
      // await trx.commit().execute();

      return true;
    } catch(e) {
      log(e);

      await trx.rollback().execute();
      return false;
    }
  }

  static async insertInstructions(recipeInstructionsInsert: RecipeInstructionInsert[]): Promise<boolean> {
    try {
      await db.insertInto("recipe_instructions_table")
        .values(recipeInstructionsInsert)
        .execute();

      return true;
    } catch (error) {
      log(error);
      return false;
    }
  }
}