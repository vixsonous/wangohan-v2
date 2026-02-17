"use client";

import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import dynamic from "next/dynamic";
import z from "zod";
import {RecipeSchema} from "@/types/recipe-types";
import Loader from "@/components/loader";

const RecipeForm = dynamic(() => import("@/app/_root-components/root-recipe-form/root-recipe-form"), { ssr: false, loading: () => <Loader /> });
interface RecipeFormProps {
  recipe_data: z.infer<typeof RecipeSchema.UpdateRecipe>
}
export default function EditRecipeFormWrapper(recipe: RecipeFormProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RecipeForm recipe_data={recipe.recipe_data} />
    </QueryClientProvider>
  )
}