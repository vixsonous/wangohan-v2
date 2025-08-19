import Image from "@/components/Image/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import z from "zod";
import {RecipeSchema} from "@/types/recipe-types";
import {UserSchema} from "@/types/user-types.user";

export default function MyRecipes(
  {my_recipes, user_id, user_codename, user_data}: {
    my_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
    user_id: number,
    user_codename: string,
    user_data: z.infer<typeof UserSchema.User> | undefined
  }
) {
  return (
    <Card className="bg-secondary-bg pb-0 rounded-b-none">
      <CardHeader><h1>{user_id === user_data?.user_id ? `My` : `${user_codename}'s`} Recipes</h1></CardHeader>
      <CardContent className="grid p-1 grid-cols-3 gap-1 grid-rows-3">
        {my_recipes !== undefined && my_recipes.length > 0 ? (
          my_recipes.map( a => {
            return (
              <Link href={"/recipe/show/" + a.recipe_id + "/" + a.recipe_name} key={a.recipe_id} className="w-full h-full min-h-51.5 group relative">
                <Image src={a.recipe_image} width={300} height={300} alt="my recipes images" className="w-full rounded-md group-hover:brightness-50 transition-all duration-200 h-full object-cover aspect-square bg-gray-300" />
                <h1 className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 text-white font-bold text-lg">
                  {a.recipe_name}
                </h1>
              </Link>
            )
          })
        ) : (
          <>
            <span className={"row-span-1 col-span-3 min-h-51.5"}></span>
            <h1 className={"row-span-1 col-span-3 min-h-51.5 flex justify-center font-bold text-lg lg:text-2xl text-primary-text"}>レシピを投稿してみましょう！</h1>
            <span className={"row-span-1 col-span-3 min-h-51.5"}></span>
          </>
        )}
      </CardContent>
    </Card>
  )
}