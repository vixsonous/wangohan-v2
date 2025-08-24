import z from "zod";
import { db } from "@/database/database";
import {
  RecipeImageInsert,
  RecipeIngredientInsert,
  RecipeInsert,
  RecipeInstructionInsert,
  RecipeUpdate
} from "@/database/types";
import { log } from "../utils/log";
import { RecipeDisplaySchema, RecipeSchema} from "../types/recipe-types";
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import {ImageProcess} from "../Images/image-service";
import {Image} from "../Images/image";

export class RecipeRepository {
  private static FRONT_PAGE_RECIPE_QUERY_LIMIT = 10;

  private static START_PAGE = 0;

  private static RECIPE_SUCCESS_LOGS = {
    GET_LIKED_RECIPE_SUCCESS: "Successfully retrieved liked recipes!"
  }

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
          jsonObjectFrom(
            eb.selectFrom("user_details_table")
              .select([
                "user_codename",
                "user_id",
                "user_image"
              ]).whereRef("user_id", "=", "recipes_table.user_id")
          ).as("user"),
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
        is_deleted: false,
        updated_at: new Date(),
        created_at: new Date()
      } satisfies RecipeInsert;

      const {recipe_id} = await trx.insertInto("recipes_table")
        .values(newRecipe)
        .returning("recipe_id")
        .executeTakeFirstOrThrow();
      
      const newInstructions: RecipeInstructionInsert[] = recipe.recipe_instructions.map( (i) => ({
        recipe_instructions_text: i.recipe_instructions_text,
        recipe_id: recipe_id,
        updated_at: new Date(),
        created_at: new Date(),
      }));

      await trx.insertInto("recipe_instructions_table")
        .values(newInstructions)
        .execute();

      const newIngredients: RecipeIngredientInsert[] = recipe.recipe_ingredients.map( (i ) => ({
        recipe_ingredients_amount: i.recipe_ingredients_amount,
        recipe_ingredients_name: i.recipe_ingredients_name,
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
        return {key: uploadDone.Key, order: idx, filename: i.originalname};
      }));

      const insertImages: RecipeImageInsert[] = images.map( i => ({
          recipe_id,
          recipe_image: `r2://${i.key}`,
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

  static async updateRecipe(recipe: z.infer<typeof RecipeSchema.UpdateRecipe>): Promise<boolean> {
    const trx = await db.startTransaction().execute();
    try {

      const recipeId = recipe.recipe_id;

      if(recipeId === undefined) {
        console.error("Please provide recipe ID!");
        return false;
      }

      const rcInstructionDeleteIds = recipe.delete_recipe_instruction_ids;
      const rcIngredientDeleteIds = recipe.delete_recipe_ingredient_ids;
      if(rcInstructionDeleteIds !== undefined) {
        await trx.deleteFrom("recipe_instructions_table")
          .where("recipe_instructions_id", "in", rcInstructionDeleteIds)
          .execute();
      }

      if(rcIngredientDeleteIds !== undefined) {
        await trx.deleteFrom("recipe_ingredients_table")
          .where("recipe_ingredient_id", "in", rcIngredientDeleteIds)
          .execute();
      }

      const rcImageDeleteIds = recipe.delete_image_ids;
      if(rcImageDeleteIds !== undefined) {
        await Promise.all(rcImageDeleteIds.map( async deleteImage => {

          let key = deleteImage.delete_image_key;

          if(key.startsWith("r2://")) {
            key = key.slice(5);
          }

          return Image.deleteR2Public(key);
        }));

        const deleteIds = rcImageDeleteIds.map(deleteImage => Number(deleteImage.delete_image_id));

        await trx.deleteFrom("recipe_images_table")
          .where("recipe_image_id","in", deleteIds)
          .returningAll()
          .execute();
      }

      const images = await Promise.all(recipe.recipe_images.map(async image => {
        if(image.size === 0) return undefined;

        const buffer: Buffer<ArrayBuffer> = Buffer.from(image.buffer);

        let imageProcess = new ImageProcess(buffer.buffer);

        imageProcess = imageProcess.resize(1024, undefined, {
          withoutEnlargement: true,
          fit: "inside"
        });

        imageProcess = imageProcess.webp({
          quality: 80
        });

        const uploadImage = await imageProcess.result();

        const folder = `${String(recipe.user_id).padStart(8, "0")}/recipes/${String(recipe.recipe_id).padStart(8, "0")}`;
        const uploadDone = await Image.uploadToR2Public(folder, uploadImage, image.originalname.split(".")[0], "webp", "images/webp");

        return {key: uploadDone.Key, order: 0, filename: image.originalname};
      }));

      const newImages: Array<RecipeImageInsert> =[];

      for(let x = 0; x < images.length; x++) {
        const img = images[x];
        if(img !== undefined) {
          newImages.push({
            recipe_id: recipeId,
            recipe_image_title: img.filename,
            recipe_image: `r2://${img.key}`,
            recipe_image_subtext: "",
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }

      if(newImages.length > 0) {
        await trx.insertInto("recipe_images_table")
          .values(newImages)
          .execute();
      }

      const recipeUpdate: RecipeUpdate = {
        recipe_name: recipe.recipe_name,
        recipe_description: recipe.recipe_description,
        recipe_age_tag: recipe.recipe_age_tag,
        recipe_event_tag: recipe.recipe_event_tag,
        recipe_size_tag: recipe.recipe_size_tag,
        updated_at: new Date()
      } satisfies RecipeUpdate;

      await trx.updateTable("recipes_table")
        .set(recipeUpdate)
        .where("recipe_id", "=", recipeId)
        .executeTakeFirstOrThrow();

      // Insert or update recipe instructions
      for(let i = 0; i < recipe.recipe_instructions.length; i++) {
        const rcInsId = recipe.recipe_instructions[i].recipe_instructions_id;

        if(rcInsId !== undefined) {
          await trx.updateTable("recipe_instructions_table")
            .set({
              recipe_instructions_text: recipe.recipe_instructions[i].recipe_instructions_text,
            })
            .where("recipe_instructions_id","=", rcInsId)
            .execute();
        } else {
          const newRecipeInstructions = {
            recipe_instructions_text: recipe.recipe_instructions[i].recipe_instructions_text,
            recipe_id: recipeId,
            updated_at: new Date(),
            created_at: new Date(),
          } satisfies RecipeInstructionInsert;

          await trx.insertInto("recipe_instructions_table")
            .values(newRecipeInstructions)
            .execute();
        }
      }

      // Insert or update recipe ingredients
      for(let i = 0; i < recipe.recipe_ingredients.length; i++) {
        const rcIngId = recipe.recipe_ingredients[i].recipe_ingredient_id;

        if(rcIngId !== undefined) {
          await trx.updateTable("recipe_ingredients_table")
            .set({
              recipe_ingredients_name: recipe.recipe_ingredients[i].recipe_ingredients_name,
              recipe_ingredients_amount: recipe.recipe_ingredients[i].recipe_ingredients_amount,
            })
            .where("recipe_ingredient_id","=", rcIngId)
            .execute();
        } else {
          const newRecipeIngredient = {
            recipe_ingredients_name: recipe.recipe_ingredients[i].recipe_ingredients_name,
            recipe_ingredients_amount: recipe.recipe_ingredients[i].recipe_ingredients_amount,
            recipe_id: recipeId,
            updated_at: new Date(),
            created_at: new Date(),
          } satisfies RecipeIngredientInsert;

          await trx.insertInto("recipe_ingredients_table")
            .values(newRecipeIngredient)
            .execute();
        }
      }

      await trx.commit().execute();
      return true;
    } catch(e) {
      console.error("Recipe update failed!");
      log(e);
      await trx.rollback().execute();
      return false;
    }
  }

  private static BASIC_RECIPES_LIMIT = 9;

  static async getLikedRecipes(user_id: number, page: number) : Promise<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined> {
    try {
      const likedRecipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> = await db.selectFrom("likes_table")
        .innerJoin("recipes_table", "recipes_table.recipe_id", "likes_table.recipe_id")
        .select(lteb => [
          "recipes_table.recipe_id",
          "recipes_table.recipe_name",
          lteb.fn.coalesce(
            lteb.selectFrom("recipe_images_table")
              .select("recipe_image")
              .limit(1)
              .whereRef("recipes_table.recipe_id", "=", "recipe_images_table.recipe_id")
            ,
            lteb.val("")
          ).as("recipe_image"),
          "recipes_table.user_id",
          "recipes_table.updated_at",
          "recipes_table.created_at"
        ])
        .where("recipes_table.user_id", "=", user_id)
        .where("likes_table.is_liked", "=", true)
        .limit(RecipeRepository.BASIC_RECIPES_LIMIT)
        .offset(RecipeRepository.BASIC_RECIPES_LIMIT * page)
        .execute();

      log(RecipeRepository.RECIPE_SUCCESS_LOGS.GET_LIKED_RECIPE_SUCCESS);
      return likedRecipes;
    } catch(e) {
      log(e);
      return undefined;
    }
  }

  static async getOwnedRecipes(user_id: number, page: number) : Promise<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined> {
    try {
      const likedRecipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> = await db.selectFrom("recipes_table")
        .select(lteb => [
          "recipes_table.recipe_id",
          "recipes_table.recipe_name",
          lteb.fn.coalesce(
            lteb.selectFrom("recipe_images_table")
              .select("recipe_image")
              .limit(1)
              .whereRef("recipes_table.recipe_id", "=", "recipe_images_table.recipe_id")
            ,
            lteb.val("")
          ).as("recipe_image"),
          "recipes_table.user_id",
          "recipes_table.updated_at",
          "recipes_table.created_at"
        ])
        .where("recipes_table.user_id", "=", user_id)
        .limit(RecipeRepository.BASIC_RECIPES_LIMIT)
        .offset(RecipeRepository.BASIC_RECIPES_LIMIT * page)
        .execute();

      log(RecipeRepository.RECIPE_SUCCESS_LOGS.GET_LIKED_RECIPE_SUCCESS);
      return likedRecipes;
    } catch(e) {
      log(e);
      return undefined;
    }
  }
}