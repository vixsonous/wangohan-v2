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

  static async updateRecipe(recipe: z.infer<typeof RecipeSchema.UpdateRecipe>): Promise<boolean | undefined> {
    const updatedRecipe = await RecipeRepository.updateRecipe(recipe);

    return updatedRecipe;
  }

  static async getLikedRecipe(user_id: number, page: number): Promise<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined> {

    return await RecipeRepository.getLikedRecipes(user_id, page);
  }

  static async getOwnedRecipe(user_id: number, page: number): Promise<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined> {

    return await RecipeRepository.getOwnedRecipes(user_id, page);
  }
}