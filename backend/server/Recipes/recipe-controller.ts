import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiUtils";
import { RecipeService } from "./recipe-service";
import { log } from "../utils/log";

export class RecipeController {
  static async getWeeklyRecipes(_: Request, res: Response) {
    const recipes = await RecipeService.getWeeklyRecipes();
    ApiResponse.success(res, "Successfully retrieved weekly recipes!", recipes, 200);
  }

  static async getPopularRecipes(_: Request, res: Response) {
    const recipes = await RecipeService.getPopularRecipes();
    ApiResponse.success(res, "Successfully retrieved popular recipes!", recipes, 200);
  }
  
  static async getRecipe(req: Request, res: Response) {
    const {recipe_id, recipe_name} = req.query;
    
    if(Number.isNaN(recipe_id) || Number.isInteger(recipe_id) || recipe_id === undefined) {
      log("Recipe ID is not valid");
      ApiResponse.error(res, "Please provide a valid recipe id");
    }

    if(recipe_name === undefined) {
      log("Recipe name is undefined");
      ApiResponse.error(res, "Please provide a valid recipe name");
    }

    const recipe = await RecipeService.getRecipe(Number(recipe_id), String(recipe_name));

    if(recipe === undefined) {
      log("Recipe not found");
      ApiResponse.error(res, "Unsuccessful retrieval of recipe");
    }

    log("Recipe retrieval success!");
    ApiResponse.success(res, "Successfully retrieved popular recipes!");
  }
}