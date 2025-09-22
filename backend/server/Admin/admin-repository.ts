import z from "zod";
import {AdminRecipeSchema} from "@/server/types/recipe-types";
import {AdminBlogSchema} from "@/server/Blog/blog-types";
import {AdminUserSchema} from "@/server/types/user-types.user";
import {db} from "@/database/database";
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import {log} from "@/server/utils/log";
import {AdminControllerSchema} from "@/server/Admin/admin-controller";

export class AdminRepository {
  static async getAdminData(): Promise<{
    recipes: z.infer<typeof AdminRecipeSchema.Recipe>[],
    blogs: z.infer<typeof AdminBlogSchema.Blog>[],
    users: z.infer<typeof AdminUserSchema.User>[]
  } | undefined> {
    try {

      const recipes: z.infer<typeof AdminRecipeSchema.Recipe>[] = await db
        .selectFrom("recipes_table")
        .select((eb) => [
          "recipe_name",
          "recipe_id",
          "recipe_description",
          jsonObjectFrom(
            eb.selectFrom("user_details_table")
              .select([
                "user_codename",
                "user_id",
                "user_image"
              ]).whereRef("user_id", "=", "recipes_table.user_id")
          ).as("user"),
          "recipes_table.created_at",
          "total_likes",
          "total_views",
          "is_published",
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
              .select(({ fn }) => [
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
        .execute();

      const blogs: z.infer<typeof AdminBlogSchema.Blog>[] = await db.selectFrom("blog_columns_table")
        .select(["blog_id", "title", "is_published"])
        .execute();

      const users: z.infer<typeof AdminUserSchema.User>[] = await db.selectFrom("users_table")
        .innerJoin("user_details_table", "users_table.user_id", "user_details_table.user_id")
        .select([
          "users_table.user_id",
          "user_image",
          "user_codename",
          "user_lvl"
        ])
        .execute();

      log("Successfully retrieved all recipes!");
      return {
        recipes,
        blogs,
        users
      };
    } catch (error) {
      log("There was an error retrieving all recipes!");
      console.error(error);
      return undefined;
    }
  }

  static async publishRecipe(data: z.infer<typeof AdminControllerSchema.PublishRecipe>) {
    try {
      await db.updateTable("recipes_table")
        .set({
          is_published: data.is_published
        })
        .returningAll()
        .where("recipe_id", "=", data.recipe_id)
        .executeTakeFirstOrThrow();

      log(`Successfully ${data.is_published ? 'published' : 'unpublished'} the recipe!`);
      return true;
    } catch (e) {
      log(e);
      return false;
    }
  }
}