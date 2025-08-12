import Image from "@/components/Image/server";
import EditRecipeFormWrapper from "@/app/(protected-user)/recipe/edit/[recipeId]/[recipeName]/edit-recipe-form-wrapper";
import {getRecipe} from "@/server-actions/Recipe/recipe";
import z from "zod";
import {RecipeSchema} from "@/types/recipe-types";

type Props = {
  params: Promise<{ recipeId: string, recipeName: string }>;
};

export default async function EditRecipe({params}: Props) {

  const {recipeId, recipeName} = await params;

  const recipe = await getRecipe(Number(recipeId), recipeName, true) as z.infer<typeof RecipeSchema.UpdateRecipe> | undefined;
  if(recipe === undefined) {
    return (
      <h1>
        Recipe not found
      </h1>
    )
  }

  return (
    <section suppressHydrationWarning className="max-w-3xl flex flex-col items-center">
      <header className="flex justify-center items-center relative mt-[10px] mb-[30px]">
        <h1 className="absolute z-10 top-1/2 -translate-y-1/4 font-semibold text-primary-text text-[2em] mb-10">レシピを書く</h1>
        <Image src={'/icons/btn/recipe-button.webp'}
          preload
          className="self-center rounded-md h-auto w-[300px] relative top-0" 
          width={300} 
          alt="create recipe button" 
        />
      </header>
      <EditRecipeFormWrapper recipe_data={recipe} />
    </section>
  )
}