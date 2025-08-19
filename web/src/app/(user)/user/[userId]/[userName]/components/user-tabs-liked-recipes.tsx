import Image from "@/components/Image/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import z from "zod";
import {RecipeSchema} from "@/types/recipe-types";
import {UserSchema} from "@/types/user-types.user";

export default async function LikedRecipes(
  {liked_recipes, user_id, user_codename, user_data}: {
    liked_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
    user_id: number,
    user_codename: string,
    user_data: z.infer<typeof UserSchema.User> | undefined
  }
) {
  return (
    <Card className="bg-secondary-bg pb-0 rounded-b-none">
      <CardHeader><h1>{user_id === user_data?.user_id ? `My` : `${user_codename}'s`} Liked Recipes</h1></CardHeader>
      <CardContent className="grid p-1 grid-cols-3 gap-1 grid-rows-3">
        {liked_recipes !== undefined && liked_recipes.length > 0 ? (
          liked_recipes.map( (a, idx) => {
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
  )
}