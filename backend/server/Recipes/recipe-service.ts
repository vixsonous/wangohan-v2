import z from "zod";
import { RecipeRepository } from "./recipe-repository";
import {RecipeDisplaySchema, RecipeSchema} from "../types/recipe-types";
import {RecipeControllerValidationSchema} from "@/server/types/recipe-types.controller";
import {UserSchema} from "@/server/types/user-types.user";

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

  static async getRecipeOwner(recipe_id: number): Promise<z.infer<typeof UserSchema.UserDisplay> | undefined> {
    return await RecipeRepository.getRecipeOwner(recipe_id);
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

  static async getRecipeList(page_no: number): Promise<z.infer<typeof RecipeSchema.RecipeList> | undefined> {
    return await RecipeRepository.getRecipeList(page_no);
  }

  static async getSearchRecipeList(page_no: number, search_text: string): Promise<z.infer<typeof RecipeSchema.SearchRecipeList> | undefined> {
    return await RecipeRepository.getSearchRecipeList(page_no, search_text);
  }

  static async getArchivedRecipes(user_id: number, page: number): Promise<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined> {
    const GET_ARCHIVED = true;
    return await RecipeRepository.getOwnedRecipes(user_id, page, GET_ARCHIVED);
  }

  static async hardDeleteRecipe(recipe_id: number, recipe_name: string, user_id:number): Promise<boolean> {
    return await RecipeRepository.hardDeleteRecipe(recipe_id, recipe_name, user_id);
  }

  static async viewedRecipe(recipe_id: number) {
    return await RecipeRepository.viewedRecipe(recipe_id);
  }

  static async likeRecipe(recipe_id: number, user_id: number, is_liked: boolean) {
    return await RecipeRepository.likeRecipe(recipe_id, user_id, is_liked);
  }

  static async isLikedRecipe(recipe_id: number, user_id: number) {
    return await RecipeRepository.isLikedRecipe(recipe_id, user_id);
  }

  static async postComment(comment: z.infer<typeof RecipeControllerValidationSchema.PostComment>) {
    return await RecipeRepository.postComment(comment);
  }

  static async getComments(recipe_id: number, page: number) {
    return await RecipeRepository.getComments(recipe_id, page);
  }
}