import z from "zod";
import { RecipeRepository } from "./recipe-repository";
import { PostRecipeSchema, RecipeDisplayDetails } from "./recipe-types";
import { RecipeInsert, RecipeInstructionInsert } from "../../database/types";

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

  static async postRecipe(recipe: z.infer<typeof PostRecipeSchema>): Promise<boolean | undefined> {

    const newRecipe = await RecipeRepository.insertRecipe(recipe);

    return newRecipe;
  }
}