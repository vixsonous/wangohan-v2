import Image from "@/components/Image/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyRecipes from "./user-tabs-my-recipes"
import LikedRecipes from "./user-tabs-liked-recipes"

export default async function UserTabs() {
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
       <MyRecipes /> 
      </TabsContent>
      <TabsContent value="liked-recipes">
        <LikedRecipes />
      </TabsContent>
    </Tabs>
  )
}