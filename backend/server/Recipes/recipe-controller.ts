import { Request, Response } from "express";
import {ApiResponse} from "../utils/ApiUtils";
import { RecipeService } from "./recipe-service";
import { log } from "../utils/log";
import {CacheUtil, RecipeCacheKey} from "../utils/redis";
import {RecipeDisplaySchema, RecipeSchema} from "../types/recipe-types";
import z from "zod";
import {getUserData} from "@/server/utils/server-utils";

export class RecipeController {

  private static RECIPE_SUCCESS_MESSAGE_RESPONSE = {
    SUCCESS_WEEKLY_RECIPE: "Successfully retrieved weekly recipes!",
    SUCCESS_POPULAR_RECIPE: "Successfully retrieved popular recipes!",
    SUCCESS_GET_RECIPE: "Successfully retrieved the recipe!",
    SUCCESS_POST_RECIPE: "Successfully posted recipe!",
  }

  private static RECIPE_ERROR_MESSAGE_RESPONSE = {
    INVALID_RECIPE_ID: "Please provide a valid recipe id!",
    INVALID_RECIPE_NAME: "Please provide a valid recipe name!",
    UNSUCCESSFUL_RECIPE_RETRIEVAL: "Unsuccessful retrieval of recipe! Please try again!",
    UNAUTHORIZED: "Please log in to upload recipe!",
    RECIPE_UPLOAD_FAILED: "There was an error uploading recipe. Please try again!",
  }

  private static RECIPE_ERROR_MESSAGE_LOG = {
    INVALID_RECIPE_ID: "Recipe ID is not valid!",
    INVALID_RECIPE_NAME: "Recipe name is not valid!",
    UNSUCCESSFUL_RECIPE_RETRIEVAL: "Recipe is not found!",
    UNAUTHORIZED: "Unauthorized!",
    RECIPE_UPLOAD_FAILED: "Failed to upload recipe!",
  }

  static async getWeeklyRecipes(_: Request, res: Response) {
    const GET_WEEKLY_RECIPES_KEY = 'GET:weekly-recipes';
    const recipes = await CacheUtil.get<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[], typeof RecipeService.getWeeklyRecipes>(GET_WEEKLY_RECIPES_KEY, RecipeService.getWeeklyRecipes);
    ApiResponse.success(res, RecipeController.RECIPE_SUCCESS_MESSAGE_RESPONSE.SUCCESS_WEEKLY_RECIPE, recipes, 200);
  }

  static async getPopularRecipes(_: Request, res: Response) {
    const GET_POPULAR_RECIPES_KEY = 'GET:popular-recipes';
    const recipes = await CacheUtil.get<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[], typeof RecipeService.getPopularRecipes>(GET_POPULAR_RECIPES_KEY, RecipeService.getPopularRecipes);
    ApiResponse.success(res, RecipeController.RECIPE_SUCCESS_MESSAGE_RESPONSE.SUCCESS_POPULAR_RECIPE, recipes, 200);
  }
  
  static async getRecipe(req: Request, res: Response) {
    const {recipe_id, recipe_name, is_edit} = req.query;

    const GET_RECIPE_KEY = `GET:recipe_id=${recipe_id}&recipe_name=${recipe_name}`;

    if(Number.isNaN(recipe_id) || Number.isInteger(recipe_id) || recipe_id === undefined) {
      log(RecipeController.RECIPE_ERROR_MESSAGE_LOG.INVALID_RECIPE_ID);
      ApiResponse.error(res, RecipeController.RECIPE_ERROR_MESSAGE_RESPONSE.INVALID_RECIPE_ID);
      return;
    }

    if(recipe_name === undefined) {
      log(RecipeController.RECIPE_ERROR_MESSAGE_LOG.INVALID_RECIPE_NAME);
      ApiResponse.error(res, RecipeController.RECIPE_ERROR_MESSAGE_RESPONSE.INVALID_RECIPE_NAME);
      return;
    }
    
    const recipe = await CacheUtil.get<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplay>, typeof RecipeService.getRecipe>(
      GET_RECIPE_KEY,
      RecipeService.getRecipe, 60, Number(recipe_id), String(recipe_name), Boolean(is_edit)
    ).catch( (err: undefined) => err);

    if(recipe === undefined) {
      log(RecipeController.RECIPE_ERROR_MESSAGE_LOG.UNSUCCESSFUL_RECIPE_RETRIEVAL);
      ApiResponse.error(res, RecipeController.RECIPE_ERROR_MESSAGE_RESPONSE.UNSUCCESSFUL_RECIPE_RETRIEVAL);
      return;
    }

    log(RecipeController.RECIPE_SUCCESS_MESSAGE_RESPONSE.SUCCESS_GET_RECIPE);
    ApiResponse.success(res, RecipeController.RECIPE_SUCCESS_MESSAGE_RESPONSE.SUCCESS_GET_RECIPE, recipe);
  }

  static async uploadRecipe(req: Request, res: Response) {

    if(req.user === undefined) {
      ApiResponse.unauthorized(res, RecipeController.RECIPE_ERROR_MESSAGE_RESPONSE.UNAUTHORIZED);
      return;
    }

    const user = req.user as {user_id: number, username: string};

    const files: Express.Multer.File[] | undefined = req.files as Express.Multer.File[];

    const formData = req.body;
    
    const submitData = {
      ...formData,
      recipe_images: [...files],
      user_id: user.user_id
    }

    const submitParseResult = RecipeSchema.PostRecipe.safeParse(submitData);

    if(!submitParseResult.success) {
      const message = submitParseResult.error.issues[0].message;
      log(message);
      ApiResponse.error(res, message);
      return;
    }

    const insertRecipeId = await RecipeService.postRecipe(submitParseResult.data);

    if(insertRecipeId === undefined) {
      log(RecipeController.RECIPE_ERROR_MESSAGE_LOG.RECIPE_UPLOAD_FAILED);
      ApiResponse.error(res, RecipeController.RECIPE_ERROR_MESSAGE_RESPONSE.RECIPE_UPLOAD_FAILED);
      return;
    }

    ApiResponse.success(res, RecipeController.RECIPE_SUCCESS_MESSAGE_RESPONSE.SUCCESS_POST_RECIPE);
  }

  static async updateRecipe(req: Request, res: Response) {

    const formData = req.body;

    const user = req.user ? req.user as {user_id: number, username: string} : undefined;

    if(user === undefined || (user.user_id !== Number(formData.user_id))) {

      ApiResponse.unauthorized(res, "You are not authorized to edit this recipe!");
      return;
    }

    const files: Express.Multer.File[] | undefined = req.files as Express.Multer.File[];

    const submitData = {
      recipe_id: Number(formData.recipe_id),
      recipe_name: formData.recipe_name,
      recipe_description: formData.recipe_description,
      recipe_instructions: formData.recipe_instructions.map(
        (i: z.infer<typeof RecipeSchema.RecipeInstruction>) =>
          ({...i, recipe_instructions_id: i.recipe_instructions_id ? Number(i.recipe_instructions_id): undefined })
        ),
      recipe_ingredients: formData.recipe_ingredients.map( (i: z.infer<typeof RecipeSchema.RecipeIngredient>) =>
          ({...i, recipe_ingredient_id: i.recipe_ingredient_id ? Number(i.recipe_ingredient_id) : undefined})
        ),
      user_id: formData.user_id,
      checkbox_size: formData.checkbox_size,
      checkbox_age: formData.checkbox_age,
      checkbox_event: formData.checkbox_event,
      recipe_event_tag: formData.recipe_event_tag,
      recipe_age_tag: formData.recipe_age_tag,
      recipe_size_tag: formData.recipe_size_tag,
      recipe_images: [...files],
      delete_image_ids: formData.delete_image_ids?.map(
        (i: z.infer<typeof RecipeSchema.ImageDeleteSchema>) =>
          ({delete_image_id: Number(i.delete_image_id), delete_image_key: i.delete_image_key})),
      delete_recipe_ingredient_ids: formData.delete_recipe_ingredient_ids?.map( (i: string) => Number(i)),
      delete_recipe_instruction_ids: formData.delete_recipe_instruction_ids?.map( (i: string) => Number(i)),
    } satisfies z.infer<typeof RecipeSchema.UpdateRecipe>;

    const submitParseResult = RecipeSchema.UpdateRecipe.safeParse(submitData);

    if(!submitParseResult.success) {
      ApiResponse.error(res, submitParseResult.error.issues[0].message);
      return;
    }

    await RecipeService.updateRecipe(submitParseResult.data);
    const GET_RECIPE_KEY = `GET:recipe_id=${submitParseResult.data.recipe_id}&recipe_name=${submitParseResult.data.recipe_name}`;
    await CacheUtil.delete(GET_RECIPE_KEY);

    ApiResponse.success(res, "Successfully updated the recipe!");
  }

  static async getLikedRecipes(req: Request, res: Response) {
    const {user_id, page} = req.query;

    const likedRecipes = await RecipeService.getLikedRecipe(Number(user_id), Number(page));

    if(likedRecipes === undefined) {
      ApiResponse.error(res, "There was an error retrieving liked recipes!");
      return;
    }

    ApiResponse.success(res, "Successfully retrieved additional liked recipes!", likedRecipes);
  }

  static async getOwnRecipes(req: Request, res: Response) {
    const {user_id, page} = req.query;

    const ownedRecipes = await RecipeService.getOwnedRecipe(Number(user_id), Number(page));

    if(ownedRecipes === undefined) {
      ApiResponse.error(res, "There was an error retrieving owned recipes!");
      return;
    }

    ApiResponse.success(res, "Successfully retrieved additional owned recipes!", ownedRecipes);
  }

  static async softDeleteRecipe(req: Request, res: Response) {
    const {recipe_id, recipe_name, recipe_user_id} = req.query;

    const user = getUserData(req);

    if(user === undefined) {
      ApiResponse.error(res, "You must log in to delete this recipe!");
      return;
    }

    const submitData = {
      recipe_id: Number(recipe_id),
      recipe_name: recipe_name,
      recipe_user_id: Number(recipe_user_id),
      user_id: Number(user.user_id)
    }

    const softDeleteParseResult = RecipeSchema.DeleteRecipe.safeParse(submitData);

    if(!softDeleteParseResult.success) {
      ApiResponse.error(res, softDeleteParseResult.error.issues[0].message);
      return;
    }

    const softDeleteResult = await RecipeService.softDeleteRecipe(
      softDeleteParseResult.data.recipe_id,
      softDeleteParseResult.data.recipe_name,
      softDeleteParseResult.data.recipe_user_id
    );

    if(!softDeleteResult) {
      ApiResponse.error(res, "Failed to delete recipe!");
      return;
    }

    await CacheUtil.delete(RecipeCacheKey.GET_WEEKLY_RECIPES_KEY);
    await CacheUtil.delete(RecipeCacheKey.GET_POPULAR_RECIPES_KEY);
    await CacheUtil.delete(RecipeCacheKey.GET_RECIPE_KEY(String(softDeleteParseResult.data.recipe_id), softDeleteParseResult.data.recipe_name));

    ApiResponse.success(res, "Successfully deleted recipe!");
  }
}