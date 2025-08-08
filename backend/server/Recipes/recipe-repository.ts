import z from "zod";
import { db } from "@/database/database";
import {RecipeImageInsert, RecipeIngredientInsert, RecipeInsert, RecipeInstructionInsert} from "@/database/types";
import { log } from "../utils/log";
import { RecipeDisplaySchema, RecipeSchema} from "../types/recipe-types";
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import {ImageProcess} from "../Images/image-service";
import {Image} from "../Images/image";

export class RecipeRepository {
  private static FRONT_PAGE_RECIPE_QUERY_LIMIT = 10;

  private static START_PAGE = 0;

  static async getPopularRecipes(
    page: number = this.START_PAGE, 
    limit: number = this.FRONT_PAGE_RECIPE_QUERY_LIMIT
  ): Promise<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[]> {
    try {

      const OFFSET = page * limit;
      const recipes: z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[] = await db
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
        .orderBy("total_views", "desc")
        .limit(limit)
        .offset(OFFSET)
        .execute();

      log("Successfully retrieved popular recipes!");
      return recipes;
    } catch (error) {
      log("There was an error retrieving popular recipes!");
      console.error(error);
      return [];
    }
  }

  static async getWeeklyRecipes(): Promise<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[]> {
    try {
      const recipes: z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[] = await db
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
        .where("created_at", ">=", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .orderBy("created_at", "desc")
        .limit(this.FRONT_PAGE_RECIPE_QUERY_LIMIT)
        .execute();

      log("Successfully retrieved weekly recipes!");

      return recipes;
    } catch (error) {
      log("There was an error retrieving weekly recipes!");
      console.error(error);
      return [];
    }
  }

  static async getRecipe(recipe_id: number, recipe_name: string, is_edit: boolean):
    Promise<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplay> | z.infer<typeof RecipeSchema.UpdateRecipe> | undefined> {
    try {
      const recipe: any = await db
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
              .select(is_edit ? [
                "recipe_instructions_id",
                "recipe_instructions_text",
              ] : [
                "recipe_instructions_text",
              ]).whereRef("recipe_instructions_table.recipe_id","=","recipes_table.recipe_id")
          ).as("recipe_instructions"),
          jsonArrayFrom(
            eb.selectFrom("recipe_ingredients_table")
              .select(is_edit ? [
                "recipe_ingredient_id",
                "recipe_ingredients_name",
                "recipe_ingredients_amount",
              ] : [
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
              .whereRef("recipe_comments_table.recipe_id","=","recipes_table.recipe_id")
          ).as("recipe_comments")
        ])
        .where(eb => eb.and({
          recipe_id: recipe_id,
          recipe_name: recipe_name
        }))
        .executeTakeFirstOrThrow();

      log("Successfully retrieved recipe details!");

      return is_edit ?
        recipe as z.infer<typeof RecipeSchema.UpdateRecipe> :
        recipe as z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplay>;
    } catch (error) {
      log("There was an error retrieving recipe details.");
      console.error(error);
      return undefined;
    }
  }

  static async insertRecipe(recipe: z.infer<typeof RecipeSchema.PostRecipe>): Promise<boolean> {
    const trx = await db.startTransaction().execute();
    try {

      const recipe_age_tag = recipe.checkbox_age?.filter(a => a !== undefined && a !== 'false').join(",") || "";
      const recipe_size_tag = recipe.checkbox_size?.filter(s => s !== undefined && s !== 'false').join(",") || "";
      const recipe_event_tag = recipe.checkbox_event?.filter(e => e !== undefined && e !== 'false').join(",") || "";

      const newRecipe = {
        recipe_name: recipe.recipe_name,
        recipe_description: recipe.recipe_description,
        recipe_category: "",
        recipe_age_tag: recipe_age_tag,
        recipe_event_tag: recipe_event_tag,
        recipe_size_tag: recipe_size_tag,
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
        recipe_id: recipe_id,
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
        recipe_id: recipe_id,
        updated_at: new Date(),
        created_at: new Date()
      }));

      await trx.insertInto("recipe_ingredients_table")
        .values(newIngredients)
        .execute();

      const images = await Promise.all(recipe.recipe_images.map( async (i, idx) => {
        const buffer: Buffer<ArrayBuffer> = Buffer.from(i.buffer);
        let image = new ImageProcess(buffer.buffer);

        image = image.resize(1024, undefined, {
            withoutEnlargement: true,
            fit: "inside"
        });

        image = image.webp({
            quality: 80
        });

        const uploadImage = await image.result();

        const folder = `${String(recipe.user_id).padStart(8, "0")}/recipes/${String(recipe_id).padStart(8, "0")}`;
        const uploadDone = await Image.uploadToR2Public(folder, uploadImage, i.originalname.split(".")[0], "webp", "images/webp");
        console.log();
        return {key: uploadDone.Key, order: idx, filename: i.originalname};
      }));

      const insertImages: RecipeImageInsert[] = images.map( i => ({
          recipe_id,
          recipe_image: `r2://${i.key}`,
          recipe_image_order: i.order,
          recipe_image_subtext: "",
          recipe_image_title: i.filename,
          updated_at: new Date(),
          created_at: new Date()
      }));

      await trx.insertInto("recipe_images_table")
        .values(insertImages)
        .execute();

      await trx.commit().execute();

      log("Recipe insertion successful!");
      return true;
    } catch(e) {
      log("Recipe insertion failed!");
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