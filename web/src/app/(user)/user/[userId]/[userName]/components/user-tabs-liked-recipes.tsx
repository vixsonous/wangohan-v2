"use client";
import Image from "@/components/Image/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import z from "zod";
import {RecipeSchema} from "@/types/recipe-types";
import {UserSchema} from "@/types/user-types.user";
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";

export default function LikedRecipes(
  {liked_recipes, user_id, user_codename, user_data}: {
    liked_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
    user_id: number,
    user_codename: string,
    user_data: z.infer<typeof UserSchema.User> | undefined,
    total_liked: number | undefined,
  }
) {

  const [recipes, setRecipes] = useState<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined>(liked_recipes);
  const [page, setPage] = useState(1);

  const getMoreLikedRecipesMutation = useMutation({
    mutationFn: (): Promise<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>>> => new Promise(
      res => res([{recipe_id: 1, recipe_name: "test", recipe_image: "/image.webp", user_id: user_id, updated_at: new Date(), created_at: new Date()}])),
    onSuccess: (data: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>>) => {
      setRecipes(prev => {
        const newArray = prev === undefined ? ([] as Array<z.infer<typeof RecipeSchema.GetBasicRecipe>>).concat(data): prev.concat(data);
        return structuredClone(newArray);
      })
    }
  });

  return (
    <>
      <Card className="bg-secondary-bg pb-0 rounded-b-none">
        <CardHeader><h1>{user_id === user_data?.user_id ? `My` : `${user_codename}'s`} Liked Recipes</h1></CardHeader>
        <CardContent className="grid p-1 grid-cols-3 gap-1 grid-rows-3">
          {recipes !== undefined && recipes.length > 0 ? (
            recipes.map( (a, idx) => {
              return (
                <Link href={"/recipe/show/" + a.recipe_id + "/" + a.recipe_name} key={idx} className="w-full h-full min-h-51.5 group relative">
                  <Image src={a.recipe_image} width={300} height={300} alt="liked recipe image" className="w-full rounded-md group-hover:brightness-50 transition-all duration-200 h-full object-cover aspect-square bg-gray-300" />
                  <h1 className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 text-white font-bold text-lg">
                    {a.recipe_name}
                  </h1>
                </Link>
              )
            })
          ) : (
            <>
              <span className={"col-span-1 h-auto aspect-square"}>&nbsp;</span>
              <span className={"col-span-1"}></span>
              <span className={"col-span-1"}></span>
              <h1 className={"row-span-1 col-span-3 flex justify-center relative top-0 text-center font-bold text-lg lg:text-2xl text-primary-text"}>お気に入りのレシピを見つけましょう！</h1>
              <span className={"col-span-1"}></span>
              <span className={"col-span-1"}></span>
              <span className={"col-span-1"}></span>
            </>
          )}
        </CardContent>
      </Card>
      {recipes && recipes.length < 15 && (
        <div className={"w-full flex justify-center mt-2"}>
          <Button onClick={() => getMoreLikedRecipesMutation.mutate()} className={"flex items-center self-center gap-2 bg-primary-text"}>
            Get more recipes
          </Button>
        </div>
      )}
    </>
  )
}