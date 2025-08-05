import { Request, Response } from "express";
import {ApiResponse} from "../utils/ApiUtils";
import { RecipeService } from "./recipe-service";
import { log } from "../utils/log";
import { CacheUtil } from "../utils/redis";
import { PostRecipeSchema, RecipeDetailsDisplay, RecipeDisplayDetails } from "./recipe-types";

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
    const recipes = await CacheUtil.get<RecipeDisplayDetails[], typeof RecipeService.getWeeklyRecipes>(GET_WEEKLY_RECIPES_KEY, RecipeService.getWeeklyRecipes);
    ApiResponse.success(res, RecipeController.RECIPE_SUCCESS_MESSAGE_RESPONSE.SUCCESS_WEEKLY_RECIPE, recipes, 200);
  }

  static async getPopularRecipes(_: Request, res: Response) {
    const GET_POPULAR_RECIPES_KEY = 'GET:popular-recipes';
    const recipes = await CacheUtil.get<RecipeDisplayDetails[], typeof RecipeService.getPopularRecipes>(GET_POPULAR_RECIPES_KEY, RecipeService.getPopularRecipes);
    ApiResponse.success(res, RecipeController.RECIPE_SUCCESS_MESSAGE_RESPONSE.SUCCESS_POPULAR_RECIPE, recipes, 200);
  }
  
  static async getRecipe(req: Request, res: Response) {
    const {recipe_id, recipe_name} = req.query;

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
    
    const recipe = await CacheUtil.get<RecipeDetailsDisplay, typeof RecipeService.getRecipe>(
      GET_RECIPE_KEY,
      RecipeService.getRecipe, 60, Number(recipe_id), String(recipe_name)
    ) ;

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

    const user = req.user as {id: number, username: string};

    const files: Express.Multer.File[] | undefined = req.files as Express.Multer.File[];

    const formData = req.body;
    
    const submitData = {
      ...formData,
      recipe_images: [...files],
      user_id: user.id
    }

    const submitParseResult = PostRecipeSchema.safeParse(submitData);

    if(submitParseResult.success === false) {
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
}