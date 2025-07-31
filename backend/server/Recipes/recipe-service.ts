import { RecipeRepository } from "./recipe-repository";
import { RecipeDisplayDetails } from "./recipe-types";

export class RecipeService {
  static async getWeeklyRecipes(): Promise<RecipeDisplayDetails[]> {
    const recipes = await RecipeRepository.getWeeklyRecipes();
    
    return recipes;
  }
  
  static async getPopularRecipes(): Promise<RecipeDisplayDetails[]> {
    const recipes = await RecipeRepository.getPopularRecipes();
    
    return recipes;
  }

  static async getRecipe(recipe_id: number, recipe_name: string) {
    const recipe = await RecipeRepository.getRecipe(recipe_id, recipe_name);

    return recipe;
  }
}