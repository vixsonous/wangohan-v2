import {Request, Response} from 'express';
import {ApiResponse} from "@/server/utils/ApiUtils";
import {RecipeRepository} from "@/server/Recipes/recipe-repository";

export class AdminController {
  static async getAllRecipes(req: Request, res: Response) {

    const recipes = await RecipeRepository.getAllRecipes();

    ApiResponse.success(res, "Successfully retrieved all recipes", recipes);
  }
}