import z from "zod";
import { RecipeRepository } from "./recipe-repository";
import {RecipeDisplaySchema, RecipeSchema} from "../types/recipe-types";

export class RecipeService {
  static async getWeeklyRecipes(): Promise<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[]> {
    return await RecipeRepository.getWeeklyRecipes();
  }
  
  static async getPopularRecipes(): Promise<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[]> {
    
    return await RecipeRepository.getPopularRecipes();
  }

  static async getRecipe(recipe_id: number, recipe_name: string, is_edit: boolean) {

    return await RecipeRepository.getRecipe(recipe_id, recipe_name, is_edit);
  }

  static async postRecipe(recipe: z.infer<typeof RecipeSchema.PostRecipe>): Promise<boolean | undefined> {

    return await RecipeRepository.insertRecipe(recipe);
  }

  static async updateRecipe(recipe: z.infer<typeof RecipeSchema.UpdateRecipe>): Promise<boolean | undefined> {

    return await RecipeRepository.updateRecipe(recipe);
  }

  static async archiveRecipe(recipe_id: number, recipe_name: string, user_id:number, is_archive: boolean): Promise<boolean> {
    return await RecipeRepository.archiveRecipe(recipe_id, recipe_name, user_id, is_archive);
  }

  static async getLikedRecipe(user_id: number, page: number): Promise<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined> {

    return await RecipeRepository.getLikedRecipes(user_id, page);
  }

  static async getOwnedRecipe(user_id: number, page: number): Promise<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined> {

    return await RecipeRepository.getOwnedRecipes(user_id, page);
  }

  static async getArchivedRecipes(user_id: number, page: number): Promise<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined> {
    const GET_ARCHIVED = true;
    return await RecipeRepository.getOwnedRecipes(user_id, page, GET_ARCHIVED);
  }
}