"use client";

import z from "zod";
import { RecipeSchema} from "@/types/recipe-types";
import Link from "next/link";
import Image from "@/components/Image/client";

type RecipeProps = {
  recipe: z.infer<typeof RecipeSchema.GetBasicRecipe>
};

function Recipe({recipe}: RecipeProps) {
  return (
    <Link href={"/recipe/show/" + recipe.recipe_id + "/" + recipe.recipe_name} >
      <div className="relative flex flex-col gap-4">
        <Image width={400} height={400} src={recipe.recipe_image} className="aspect-square w-[100%] h-[100%] object-cover max-w-none" alt="website banner" />
      </div>
    </Link>
  )
}

type RecipeListProps = {
  recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>>
};

export default function RecipeList({recipes}: RecipeListProps) {
  return (
    <div className=" w-[100%] lg:gap-8 grid grid-cols-3 gap-0.5 md:grid-cols-4 lg:grid-cols-5">
      {recipes.map((recipe, idx) => <Recipe key={idx} recipe={recipe} />)}
    </div>
  )
}