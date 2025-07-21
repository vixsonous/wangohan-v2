import { db } from "../../database/database";
import { RecipeDisplayDetails } from "./recipe-types";
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
}