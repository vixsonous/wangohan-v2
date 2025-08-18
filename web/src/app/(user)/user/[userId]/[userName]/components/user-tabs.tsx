import Image from "@/components/Image/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyRecipes from "./user-tabs-my-recipes"
import LikedRecipes from "./user-tabs-liked-recipes"
import z from "zod";
import {RecipeSchema} from "@/types/recipe-types";

export default async function UserTabs(
  {liked_recipes, my_recipes}:
  {liked_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
    my_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined}
) {
  return (
    <Tabs defaultValue="my-recipes">
      <TabsList>
        <TabsTrigger value="my-recipes">自分のレシピ</TabsTrigger>
        <TabsTrigger value="liked-recipes">
          <Image noprocess src={"/icons/svg/primary-heart.svg"} alt="heart icon for liked recipes"/>
          したレシピ
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my-recipes">
       <MyRecipes my_recipes={my_recipes} />
      </TabsContent>
      <TabsContent value="liked-recipes">
        <LikedRecipes liked_recipes={liked_recipes} />
      </TabsContent>
    </Tabs>
  )
}