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
import {RecipeCacheUtil} from "@/server/utils/redis";
import {RecipeControllerValidationSchema} from "@/server/types/recipe-types.controller";
import {UserSchema} from "@/server/types/user-types.user";

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
        .where("is_deleted", "=", false)
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
          jsonObjectFrom(
            eb.selectFrom("user_details_table")
              .select([
                "user_codename",
                "user_id",
                "user_image"
              ]).whereRef("user_id", "=", "recipes_table.user_id")
          ).as("user"),
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
        .where("is_deleted", "=", false)
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

  static RECIPE_COMMENT_COUNT_LIMIT: number = 5;

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
              .orderBy("recipe_comments_table.created_at","desc")
              .limit(RecipeRepository.RECIPE_COMMENT_COUNT_LIMIT)
              .whereRef("recipe_comments_table.recipe_id","=","recipes_table.recipe_id")
          ).as("recipe_comments"),
          eb.fn.coalesce(eb.selectFrom("recipe_comments_table").select(({fn}) => [
            fn.count<number>("recipe_comments_table.recipe_id").as("total_comments")
          ]).where("recipe_comments_table.recipe_id", "=", recipe_id), eb.val(0)).as("total_comments")
        ])
        .where(eb => eb.and({
          recipe_id: recipe_id,
          recipe_name: recipe_name,
          is_deleted: false
        }))
        .executeTakeFirstOrThrow();

      log("Successfully retrieved recipe details!");
      console.log(recipe);
      return is_edit ?
        recipe as z.infer<typeof RecipeSchema.UpdateRecipe> :
        recipe as z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplay>;
    } catch (error) {
      log("There was an error retrieving recipe details.");
      console.error(error);
      return undefined;
    }
  }

  static async getRecipeOwner(recipe_id: number): Promise<z.infer<typeof UserSchema.UserDisplay> | undefined> {
    try {
      const user = await db.selectFrom("recipes_table")
        .select(eb => jsonObjectFrom(
          eb.selectFrom("user_details_table")
            .select([
              "user_codename",
              "user_id",
              "user_image"
            ]).whereRef("user_id", "=", "recipes_table.user_id")
        ).as("user"))
        .where("recipes_table.recipe_id","=", recipe_id)
        .executeTakeFirstOrThrow();

      log("Successfully retrieved recipe owner");
      return user.user;
    } catch(e) {
      log(e);
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
        .where(eb => eb.and({
          is_liked: true,
          is_deleted: false
        }))
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

  static async getOwnedRecipes(user_id: number, page: number, get_archived: boolean = false) : Promise<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined> {
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
        .where(eb => eb.and({
          user_id: user_id,
          is_deleted: get_archived
        }))
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

  private static LIST_RECIPES_LIMIT = 20;

  static async getRecipeList(page: number) : Promise<z.infer<typeof RecipeSchema.RecipeList> | undefined> {
    try {
      const recipeList: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> = await db.selectFrom("recipes_table")
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
        .orderBy("recipes_table.created_at", "desc")
        .limit(RecipeRepository.LIST_RECIPES_LIMIT)
        .offset(RecipeRepository.LIST_RECIPES_LIMIT * page)
        .execute();

      log(RecipeRepository.RECIPE_SUCCESS_LOGS.GET_LIKED_RECIPE_SUCCESS);

      const totalRecipes = await db.selectFrom("recipes_table")
        .select(lteb => [
          lteb.fn.coalesce(lteb.selectFrom("recipes_table").select(({fn}) => [
            fn.count<number>("recipes_table.user_id").as("total_recipes")
          ]), lteb.val(0)).as("total_recipes")
        ]).executeTakeFirstOrThrow();

      return {
        recipes: recipeList,
        total_recipes: Number(totalRecipes.total_recipes)
      };
    } catch(e) {
      log(e);
      return undefined;
    }
  }

  private static SEARCH_RECIPES_LIMIT = 9;

  static async getSearchRecipeList(page: number, search_text: string) : Promise<z.infer<typeof RecipeSchema.SearchRecipeList> | undefined> {
    try {
      const recipeList: Array<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>> = await db.selectFrom("recipes_table")
        .select(lteb => [
          "recipe_name",
          "recipe_id",
          "recipe_category",
          "recipe_age_tag",
          "recipe_event_tag",
          "recipe_size_tag",
          "recipe_description",
          jsonObjectFrom(
            lteb.selectFrom("user_details_table")
              .select([
                "user_codename",
                "user_id",
                "user_image"
              ]).whereRef("user_id", "=", "recipes_table.user_id")
          ).as("user"),
          "created_at",
          "total_likes",
          "total_views",
          jsonArrayFrom(
            lteb.selectFrom("recipe_images_table")
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
            lteb.selectFrom("recipe_comments_table")
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
          lteb.fn.coalesce(
            lteb.selectFrom("recipe_images_table")
              .select("recipe_image")
              .limit(1)
              .whereRef("recipes_table.recipe_id", "=", "recipe_images_table.recipe_id")
            ,
            lteb.val("")
          ).as("recipe_image"),
        ])
        .orderBy("recipes_table.created_at", "desc")
        .where(({ eb, exists }) =>
          eb.or([
            eb("recipe_name", "ilike", `%${search_text}%`),
            eb("recipe_description", "ilike", `%${search_text}%`),
            eb("recipe_age_tag", "ilike", `%${search_text}%`),
            eb("recipe_size_tag", "ilike", `%${search_text}%`),
            eb("recipe_event_tag", "ilike", `%${search_text}%`),
            exists(
              eb
                .selectFrom("recipe_ingredients_table")
                .where(
                  "recipe_ingredients_table.recipe_id",
                  "=",
                  eb.ref("recipes_table.recipe_id")
                )
                .where((eb) =>
                  eb.or([
                    eb(
                      "recipe_ingredients_table.recipe_ingredients_name",
                      "ilike",
                      `%${search_text}%`
                    ),
                    eb(
                      "recipe_ingredients_table.recipe_ingredients_amount",
                      "ilike",
                      `%${search_text}%`
                    ),
                  ])
                )
            ),
            exists(
              eb
                .selectFrom("recipe_instructions_table")
                .where(
                  "recipe_instructions_table.recipe_id",
                  "=",
                  eb.ref("recipes_table.recipe_id")
                )
                .where((eb) =>
                  eb.or([
                    eb(
                      "recipe_instructions_table.recipe_instructions_text",
                      "ilike",
                      `%${search_text}%`
                    ),
                  ])
                )
            ),
          ])
        )
        .limit(RecipeRepository.SEARCH_RECIPES_LIMIT)
        .offset(RecipeRepository.SEARCH_RECIPES_LIMIT * page)
        .execute();

      log(RecipeRepository.RECIPE_SUCCESS_LOGS.GET_LIKED_RECIPE_SUCCESS);

      const totalRecipes = await db.selectFrom("recipes_table")
        .select(lteb => [
          lteb.fn.coalesce(lteb.selectFrom("recipes_table").select(({fn}) => [
            fn.count<number>("recipes_table.user_id").as("total_recipes")
          ]).where(({ eb, exists }) =>
            eb.or([
              eb("recipe_name", "ilike", `%${search_text}%`),
              eb("recipe_description", "ilike", `%${search_text}%`),
              eb("recipe_age_tag", "ilike", `%${search_text}%`),
              eb("recipe_size_tag", "ilike", `%${search_text}%`),
              eb("recipe_event_tag", "ilike", `%${search_text}%`),
              exists(
                eb
                  .selectFrom("recipe_ingredients_table")
                  .where(
                    "recipe_ingredients_table.recipe_id",
                    "=",
                    eb.ref("recipes_table.recipe_id")
                  )
                  .where((eb) =>
                    eb.or([
                      eb(
                        "recipe_ingredients_table.recipe_ingredients_name",
                        "ilike",
                        `%${search_text}%`
                      ),
                      eb(
                        "recipe_ingredients_table.recipe_ingredients_amount",
                        "ilike",
                        `%${search_text}%`
                      ),
                    ])
                  )
              ),
              exists(
                eb
                  .selectFrom("recipe_instructions_table")
                  .where(
                    "recipe_instructions_table.recipe_id",
                    "=",
                    eb.ref("recipes_table.recipe_id")
                  )
                  .where((eb) =>
                    eb.or([
                      eb(
                        "recipe_instructions_table.recipe_instructions_text",
                        "ilike",
                        `%${search_text}%`
                      ),
                    ])
                  )
              ),
            ])
          ), lteb.val(0)).as("total_recipes")
        ]).executeTakeFirstOrThrow();

      return {
        recipes: recipeList,
        total_recipes: Number(totalRecipes.total_recipes)
      };
    } catch(e) {
      log(e);
      return undefined;
    }
  }

  static async archiveRecipe(recipe_id: number, recipe_name: string, user_id: number, is_archive: boolean): Promise<boolean> {
    try {
      await db.updateTable("recipes_table")
        .set({
          is_deleted: is_archive
        })
        .where( eb => eb.and({
          recipe_id: recipe_id,
          recipe_name: recipe_name,
          user_id: user_id
        }))
        .returning("recipe_id")
        .executeTakeFirstOrThrow();

      return true;
    } catch (error) {
      log(error);
      return false;
    }
  }

  static async hardDeleteRecipe(recipe_id: number, recipe_name: string, user_id: number): Promise<boolean> {
    const DELETE_RECIPE_FAILED = "Failed to delete recipe!";
    const DELETE_RECIPE_SUCCESS = "Successfully deleted recipe!";

    const trx = await db.startTransaction().execute();
    try {

      const images = await trx.selectFrom("recipe_images_table")
        .select("recipe_image")
        .where("recipe_id", "=", recipe_id)
        .execute();

      // Delete images in the bucket
      await Promise.all(images.map(async image => {
        const key = image.recipe_image.startsWith("r2://") ? image.recipe_image.split("r2://")[1] : image.recipe_image;
        await Image.deleteR2Public(key);
      }));

      const res = await trx.deleteFrom("recipes_table")
        .where(eb => eb.and({
          recipe_id: recipe_id,
          recipe_name: recipe_name,
          user_id: user_id
        }))
        .returning("recipe_id")
        .executeTakeFirstOrThrow();

      await trx.commit().execute();
      log(DELETE_RECIPE_SUCCESS + " Recipe: " + res.recipe_id);
      return true;
    } catch (e) {
      log(DELETE_RECIPE_FAILED)
      log(e);
      await trx.rollback().execute();
      return false;
    }
  }

  static async viewedRecipe(recipe_id: number): Promise<boolean | undefined> {
    try {

      await db
        .updateTable("recipes_table")
        .set((eb) => ({
          total_views: eb("total_views", "+", 1),
        }))
        .where("recipe_id", "=", recipe_id)
        .execute();

      await RecipeCacheUtil.clearAllRecipesCache();
      return true;
    } catch (e) {
      log(e);
      return undefined;
    }
  }

  static async likeRecipe(recipe_id: number, user_id: number, is_liked: boolean): Promise<boolean | undefined> {

    const trx = await db.startTransaction().execute();
    try {
      await trx.insertInto("likes_table")
        .values({
          recipe_id: recipe_id,
          user_id: user_id,
          is_liked: is_liked,
          updated_at: new Date(),
          created_at: new Date(),
        })
        .onConflict(oc =>
          oc.columns(['user_id', 'recipe_id'])
            .doUpdateSet({is_liked: is_liked, updated_at: new Date()}))
        .execute();

      await trx.updateTable("recipes_table")
        .set((eb) => ({
          total_likes: eb("total_likes", is_liked ? "+" : "-", 1),
          updated_at: new Date(),
        }))
        .returning("total_likes")
        .where(eb => eb.and({
          recipe_id: recipe_id,
        }))
        .executeTakeFirstOrThrow();

      await trx.commit().execute();
      return true;
    } catch(e) {
      log(e);
      await trx.rollback().execute();
      return undefined;
    }
  }

  static async isLikedRecipe(recipe_id: number, user_id: number): Promise<boolean> {
    try {
      const isLiked = await db.selectFrom("likes_table")
        .select("is_liked")
        .where(eb => eb.and({
          recipe_id: recipe_id,
          user_id: user_id
        }))
        .executeTakeFirstOrThrow();

      return isLiked.is_liked;
    } catch(e) {
      log(e);
      return false;
    }
  }
  
  static async postComment(comment: z.infer<typeof RecipeControllerValidationSchema.PostComment>): Promise<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments> | undefined> {
    try {
      
      const newComment = await db.insertInto("recipe_comments_table")
        .values({
          recipe_comment_rating: comment.rating,
          recipe_comment_title: "",
          recipe_comment_subtext: comment.comment,
          recipe_id: comment.recipe_id,
          user_id: comment.user_id,
          updated_at: comment.created_at,
          created_at: comment.created_at
        })
        .returning(se => [
          "recipe_comment_rating",
          "recipe_comment_subtext",
          "created_at",
          jsonObjectFrom(
            se.selectFrom("user_details_table")
              .select(["user_image", "user_id", "user_codename"])
              .whereRef("user_details_table.user_id","=", "recipe_comments_table.user_id")
          ).as("user")
        ])
        .executeTakeFirstOrThrow();
      
      log("Successfully inserted the comment!");
      return newComment;
    } catch (e) {
      log(e);
      return undefined;
    }
    
  }

  static async getComments(recipe_id: number, page: number): Promise<Array<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments>> | undefined> {
    try {
      const comments = await db.selectFrom("recipe_comments_table")
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
        .offset(RecipeRepository.RECIPE_COMMENT_COUNT_LIMIT * page)
        .limit(RecipeRepository.RECIPE_COMMENT_COUNT_LIMIT)
        .where("recipe_comments_table.recipe_id","=",recipe_id)
        .execute();

      log("Successfully retrieved comments!");

      return comments;
    } catch (e) {
      log(e);
      return undefined;
    }
  }

  static async getAllRecipes(): Promise<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[]> {
    try {

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

      log("Successfully retrieved all recipes!");
      return recipes;
    } catch (error) {
      log("There was an error retrieving all recipes!");
      console.error(error);
      return [];
    }
  }
}