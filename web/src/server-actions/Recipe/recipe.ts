import { ServerApiService } from '@/lib/server-utils';
import { RecipeDetailsDisplay, RecipeDisplayDetails } from './recipe-types';
import z from "zod";
import {RecipeSchema} from "@/types/recipe-types";

export const getRecipe = async (recipe_id: number, recipe_name: string, is_edit: boolean):
  Promise<RecipeDetailsDisplay | z.infer<typeof RecipeSchema.UpdateRecipe> | undefined> => {
  try {
    const {data} = await ServerApiService.get(`/get-recipe?recipe_id=${recipe_id}&recipe_name=${recipe_name}&is_edit=${is_edit}`);
    return data.data;
  } catch(e) {
    console.log(e);
    return undefined;
  }
}

export const getSliderRecipes = async (): Promise<{
  weeklyRecipes: Array<RecipeDisplayDetails>, 
  popularRecipes: Array<RecipeDisplayDetails>} | undefined> => {
  try {

    const [weeklyRecipes, popularRecipes] = await Promise.all([
      await ServerApiService.get("/get-weekly-recipes"),
      await ServerApiService.get("/get-popular-recipes")
    ])

    return {
      weeklyRecipes: weeklyRecipes.data.data,
      popularRecipes: popularRecipes.data.data
    }
  } catch(e) {
    console.error(e);
    return undefined;
  }
}