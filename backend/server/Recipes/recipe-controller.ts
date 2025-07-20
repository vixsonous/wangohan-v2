import { Request, Response } from "express";
import { RecipeRepository } from "./recipe-repository";
import { ApiResponse } from "../utils/ApiUtils";

export class RecipeController {
  static async getWeeklyRecipes(req: Request, res: Response) {
    const recipes = await RecipeRepository.getWeeklyRecipes();
    ApiResponse.success(res, "Successfully retrieved weekly recipes!", recipes, 200);
  }

  static async getPopularRecipes(req: Request, res: Response) {
    const recipes = await RecipeRepository.getPopularRecipes();
    ApiResponse.success(res, "Successfully retrieved popular recipes!", recipes, 200);
  }
  
  static async getRecipe(req: Request, res: Response) {
    res.send("succes1");
  }
}