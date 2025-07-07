import { ServerApiService } from '@/lib/server-utils';

export const getRecipe = async () => {
  try {
    const data = await ServerApiService.get("/get-recipe");
    console.log(data.data);
  } catch(e) {
    console.log(e);
  }
}