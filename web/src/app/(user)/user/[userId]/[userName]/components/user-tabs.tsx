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
import {
  DeletedRecipes
} from "@/app/(user)/user/[userId]/[userName]/components/user-tabs-deleted-recipes";
import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import React, {useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import Loader from "@/components/loader";

const PersonalInfoForm = dynamic(() => import("@/app/(auth)/signup/personal-info/personal-info-form"), {ssr: false, loading: () => <Loader />});

interface UserTabsProps {
  liked_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
  my_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
  deleted_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
  user_id: number,
  user_codename: string,
  user_data: z.infer<typeof UserSchema.User> | undefined,
  total_recipes: number | undefined,
  total_liked: number | undefined,
  total_deleted: number | undefined,
}
export default function UserTabs(
  {liked_recipes, my_recipes, deleted_recipes, user_id, user_codename, user_data, total_recipes, total_liked, total_deleted}: UserTabsProps

) {

  const [open, setOpen] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs defaultValue="my-recipes">
        <div className={"flex justify-between flex-col md:flex-row gap-2"}>
          <TabsList className={"relative"}>
            <TabsTrigger className={"cursor-pointer"} value="my-recipes">自分のレシピ</TabsTrigger>
            <TabsTrigger className={"cursor-pointer"} value="liked-recipes">
              <Image noprocess src={"/icons/svg/primary-heart.svg"} alt="heart icon for liked recipes"/>
              したレシピ
            </TabsTrigger>
            {user_id === user_data?.user_id && (
              <>
                <TabsTrigger className={"cursor-pointer"} value="deleted-recipes">
                  <Image noprocess src={"/icons/svg/primary-trash.svg"} alt="trash icon for deleted recipes"/>
                  削除レシピ
                </TabsTrigger>

              </>
            )}
          </TabsList>
          {user_id === user_data?.user_id && (
            <TabsList>
              <TabsTrigger value={"edit"} asChild={true} onClick={() => alert(5)}>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger className={"flex gap-2 px-2 justify-center items-center cursor-pointer"}>
                    <Image src={"/icons/svg/primary-settings.svg"} alt={"image icon for editing profile"} width={20} height={20}/> プロフィールを編集
                  </DialogTrigger>
                  <DialogContent className={"w-256 sm:max-w-3xl"}>
                    <DialogTitle>
                      {user_codename}のプロフィール
                    </DialogTitle>
                    <ScrollArea className={"max-h-128"}>
                      <PersonalInfoForm setOpen={setOpen} user_id={user_data?.user_id || -1} is_edit={true} user_details={user_data} />
                      <DialogDescription aria-label={"description"} aria-labelledby={"description"} className={"flex justify-center"}>
                        プロフィールを編集する
                      </DialogDescription>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </TabsTrigger>
            </TabsList>
          )}

        </div>
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