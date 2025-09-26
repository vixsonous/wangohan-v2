import {ServerApiResponseService, ServerApiService} from '@/lib/server-utils';
import z from "zod";
import {RecipeDisplaySchema, RecipeSchema} from "@/types/recipe-types";
import {ENDPOINTS} from "@/constants/endpoints";

export const getRecipe = async (recipe_id: number, recipe_name: string, is_edit: boolean):
  Promise<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplay> | z.infer<typeof RecipeSchema.UpdateRecipe> | undefined> => {
  try {
    const response = await ServerApiService.get(ENDPOINTS.RECIPE + `/${recipe_id}?recipe_name=${recipe_name}&is_edit=${is_edit}`);

    return await ServerApiResponseService.getResponseData<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplay> | z.infer<typeof RecipeSchema.UpdateRecipe> | undefined>(response);
  } catch(e) {
    console.log(e);
    return undefined;
  }
}

export const getSliderRecipes = async (): Promise<{
  weeklyRecipes: z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[],
  popularRecipes: z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>[]} | undefined> => {
  try {

    const [weeklyRecipes, popularRecipes] = await Promise.all([
      await ServerApiService.get(ENDPOINTS.RECIPE + "/slider/weekly"),
      await ServerApiService.get(ENDPOINTS.RECIPE + "/slider/popular")
    ])

    return {
      weeklyRecipes: await ServerApiResponseService.getResponseData(weeklyRecipes),
      popularRecipes: await ServerApiResponseService.getResponseData(popularRecipes)
    }
  } catch(e) {
    console.error(e);
    return undefined;
  }
}