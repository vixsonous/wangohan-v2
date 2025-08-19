"use client";
import Image from "@/components/Image/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyRecipes from "./user-tabs-my-recipes"
import LikedRecipes from "./user-tabs-liked-recipes"
import z from "zod";
import {RecipeSchema} from "@/types/recipe-types";
import {UserSchema} from "@/types/user-types.user";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";

export default function UserTabs(
  {liked_recipes, my_recipes, user_id, user_codename, user_data, total_recipes, total_liked}:
  {liked_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
    my_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
    user_id: number,
    user_codename: string,
    user_data: z.infer<typeof UserSchema.User> | undefined,
    total_recipes: number | undefined,
    total_liked: number | undefined,
  }
) {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs defaultValue="my-recipes">
        <TabsList>
          <TabsTrigger value="my-recipes">自分のレシピ</TabsTrigger>
          <TabsTrigger value="liked-recipes">
            <Image noprocess src={"/icons/svg/primary-heart.svg"} alt="heart icon for liked recipes"/>
            したレシピ
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-recipes">
          <MyRecipes total_recipes={total_recipes} user_id={user_id} user_codename={user_codename} user_data={user_data} my_recipes={my_recipes} />
        </TabsContent>
        <TabsContent value="liked-recipes">
          <LikedRecipes total_liked={total_liked} user_id={user_id} user_codename={user_codename} user_data={user_data} liked_recipes={liked_recipes} />
        </TabsContent>
      </Tabs>
    </QueryClientProvider>
  )
}