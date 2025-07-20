import { ServerApiService } from '@/lib/server-utils';
import { RecipeDisplayDetails } from './recipe-types';

export const getRecipe = async () => {
  try {
    const data = await ServerApiService.get("/get-recipe");
    console.log(data.data);
  } catch(e) {
    console.log(e);
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