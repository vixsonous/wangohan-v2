import z from "zod";
import { RecipeRepository } from "./recipe-repository";
import {RecipeDisplaySchema, RecipeSchema} from "../types/recipe-types";

export class RecipeService {
  static async getWeeklyRecipes(): Promise<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[]> {
    const recipes = await RecipeRepository.getWeeklyRecipes();
    
    return recipes;
  }
  
  static async getPopularRecipes(): Promise<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[]> {
    const recipes = await RecipeRepository.getPopularRecipes();
    
    return recipes;
  }

  static async getRecipe(recipe_id: number, recipe_name: string, is_edit: boolean) {
    const recipe = await RecipeRepository.getRecipe(recipe_id, recipe_name, is_edit);

    return recipe;
  }

  static async postRecipe(recipe: z.infer<typeof RecipeSchema.PostRecipe>): Promise<boolean | undefined> {

    const newRecipe = await RecipeRepository.insertRecipe(recipe);

    return newRecipe;
  }
}