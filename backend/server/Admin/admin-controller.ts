import {Request, Response} from 'express';
import {ApiResponse} from "@/server/utils/ApiUtils";
import {RecipeService} from "@/server/Recipes/recipe-service";

export class AdminController {
  static async getAllRecipes(req: Request, res: Response) {

    const recipes = await RecipeService.getAllRecipes();

    ApiResponse.success(res, "Successfully retrieved all recipes", recipes);
  }
}