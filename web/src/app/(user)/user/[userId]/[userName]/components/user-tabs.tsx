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
import DeletedRecipes from "@/app/(user)/user/[userId]/[userName]/components/user-tabs-deleted-recipes";

export default function UserTabs(
  {liked_recipes, my_recipes, deleted_recipes, user_id, user_codename, user_data, total_recipes, total_liked, total_deleted}:
  {liked_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
    my_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
    deleted_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
    user_id: number,
    user_codename: string,
    user_data: z.infer<typeof UserSchema.User> | undefined,
    total_recipes: number | undefined,
    total_liked: number | undefined,
    total_deleted: number | undefined,
  }
) {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs defaultValue="my-recipes">
        <TabsList>
          <TabsTrigger className={"cursor-pointer"} value="my-recipes">自分のレシピ</TabsTrigger>
          <TabsTrigger className={"cursor-pointer"} value="liked-recipes">
            <Image noprocess src={"/icons/svg/primary-heart.svg"} alt="heart icon for liked recipes"/>
            したレシピ
          </TabsTrigger>
          {user_id === user_data?.user_id && (
            <TabsTrigger className={"cursor-pointer"} value="deleted-recipes">
              <Image noprocess src={"/icons/svg/primary-trash.svg"} alt="trash icon for deleted recipes"/>
              削除レシピ
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="my-recipes">
          <MyRecipes total_recipes={total_recipes} user_id={user_id} user_codename={user_codename} user_data={user_data} my_recipes={my_recipes} />
        </TabsContent>
        <TabsContent value="liked-recipes">
          <LikedRecipes total_liked={total_liked} user_id={user_id} user_codename={user_codename} user_data={user_data} liked_recipes={liked_recipes} />
        </TabsContent>
        {user_id === user_data?.user_id && (
          <TabsContent value="deleted-recipes">
            <DeletedRecipes total_deleted={total_deleted} user_id={user_id} user_data={user_data} deleted_recipes={deleted_recipes} />
          </TabsContent>
        )}
      </Tabs>
    </QueryClientProvider>
  )
}