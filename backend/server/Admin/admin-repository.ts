import z from "zod";
import {AdminRecipeSchema} from "@/server/types/recipe-types";
import {AdminBlogSchema} from "@/server/Blog/blog-types";
import {AdminUserSchema} from "@/server/types/user-types.user";
import {db} from "@/database/database";
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import {log} from "@/server/utils/log";
import {AdminControllerSchema} from "@/server/Admin/admin-controller";
import {ImageService} from "@/server/Images/image-service";

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
              .orderBy("recipe_comments_table.created_at","desc")
              .whereRef("recipe_comments_table.recipe_id","=","recipes_table.recipe_id")
          ).as("recipe_comments"),
        ])
        .orderBy("created_at", "desc")
        .execute();

      const blogs: z.infer<typeof AdminBlogSchema.Blog>[] = await db.selectFrom("blog_columns_table")
        .select(["blog_id", "title", "is_published"])
        .orderBy("created_at", "desc")
        .execute();

      const users: z.infer<typeof AdminUserSchema.User>[] = await db.selectFrom("users_table")
        .innerJoin("user_details_table", "users_table.user_id", "user_details_table.user_id")
        .select([
          "users_table.user_id",
          "user_image",
          "user_codename",
          "user_lvl"
        ])
        .orderBy("users_table.created_at", "desc")
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

  static async publishBlog(data: z.infer<typeof AdminControllerSchema.PublishBlog>) {
    try {
      await db.updateTable("blog_columns_table")
        .set({
          is_published: data.is_published
        })
        .returningAll()
        .where("blog_id", "=", data.blog_id)
        .executeTakeFirstOrThrow();

      log(`Successfully ${data.is_published ? 'published' : 'unpublished'} the blog!`);
      return true;
    } catch (e) {
      log(e);
      return false;
    }
  }

  static async deleteRecipe(data: z.infer<typeof AdminControllerSchema.DeleteRecipe>) {
    try {
      await db.deleteFrom("recipes_table")
        .where(lb => lb.and({
          recipe_id: data.recipe_id,
          recipe_name: data.recipe_name
        }))
        .executeTakeFirstOrThrow();

      log(`Successfully deleted the recipe!`);
      return true;
    } catch (e) {
      log(e);
      return false;
    }
  }

  static async deleteRecipeImages(data: z.infer<typeof AdminControllerSchema.DeleteRecipe>) {
    try {
      const images = await db.deleteFrom("recipe_images_table")
        .where(lb => lb.and({
          recipe_id: data.recipe_id,
        }))
        .returning(["recipe_image"])
        .execute();

      await ImageService.deleteR2Public(images.map(i => i.recipe_image));
      log(`Successfully deleted the recipe!`);
      return true;
    } catch (e) {
      log(e);
      return false;
    }
  }

  static async deleteBlog(data: z.infer<typeof AdminControllerSchema.DeleteBlog>) {
    try {
      await db.deleteFrom("blog_columns_table")
        .where(lb => lb.and({
          blog_id: data.blog_id,
          title: data.title
        }))
        .executeTakeFirstOrThrow();

      log(`Successfully deleted the recipe!`);
      return true;
    } catch (e) {
      log(e);
      return false;
    }
  }

  static async updateUserLevel(data: z.infer<typeof AdminControllerSchema.UpdateUserLevel>) {
    try {
      await db.updateTable("users_table")
        .set({
          user_lvl: Number(data.user_level)
        })
        .where(lb => lb.and({
          user_id: data.user_id,
        }))
        .executeTakeFirstOrThrow();

      log(`Successfully deleted the recipe!`);
      return true;
    } catch (e) {
      log(e);
      return false;
    }
  }

  static async deleteUser(data: z.infer<typeof AdminControllerSchema.DeleteUser>) {
    try {
      await db.deleteFrom("user_details_table")
        .where(lb => lb.and({
          user_id: data.user_id
        }))
        .executeTakeFirstOrThrow();

      log(`Successfully deleted the user!`);
      return true;
    } catch (e) {
      log(e);
      return false;
    }
  }
}