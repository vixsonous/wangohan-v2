"use client";
import Image from "@/components/Image/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import z from "zod";
import {RecipeSchema} from "@/types/recipe-types";
import {UserSchema} from "@/types/user-types.user";
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosResponse} from "axios";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";

export default function DeletedRecipes(
  {deleted_recipes, user_id, user_codename, user_data, total_deleted}: {
    deleted_recipes: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined,
    user_id: number,
    user_codename: string,
    user_data: z.infer<typeof UserSchema.User> | undefined,
    total_deleted: number | undefined,
  }
) {

  const [recipes, setRecipes] = useState<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> | undefined>(deleted_recipes);
  const [page, setPage] = useState(1);

  const getMoreArchivedRecipesMutation = useMutation({
    mutationFn: () => ClientApiService.get(`/get-archived-recipes?user_id=${user_id}&page=${page}`),
    onSuccess: (data: AxiosResponse) => {
      const dt: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> = ClientApiResponseService.getAxiosResponseData<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>>>(data);
      const message: string = ClientApiResponseService.getAxiosResponseMessage(data);

      toast.success('Successful!', {description: message});
      setPage(prev => prev + 1);
      setRecipes(prev => {
        const newArray = prev === undefined ? ([] as Array<z.infer<typeof RecipeSchema.GetBasicRecipe>>).concat(dt): prev.concat(dt);
        return structuredClone(newArray);
      })
    },
    onError: (error: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(error);
      toast.error("Error!", {description: message});
    }
  });

  const restoreArchivedRecipe = useMutation({
    mutationFn: () => ClientApiService.get(`/get-liked-recipes?user_id=${user_id}&page=${page}`),
    onSuccess: (data: AxiosResponse) => {
      const dt: Array<z.infer<typeof RecipeSchema.GetBasicRecipe>> = ClientApiResponseService.getAxiosResponseData<Array<z.infer<typeof RecipeSchema.GetBasicRecipe>>>(data);
      const message: string = ClientApiResponseService.getAxiosResponseMessage(data);

      toast.success('Successful!', {description: message});
      setPage(prev => prev + 1);
      setRecipes(prev => {
        const newArray = prev === undefined ? ([] as Array<z.infer<typeof RecipeSchema.GetBasicRecipe>>).concat(dt): prev.concat(dt);
        return structuredClone(newArray);
      })
    },
    onError: (error: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(error);
      toast.error("Error!", {description: message});
    }
  });

  return (
    <>
      <Card className="bg-secondary-bg pb-0 rounded-b-none">
        <CardHeader><h1>Archived Recipes</h1></CardHeader>
        <CardContent className="grid p-1 grid-cols-3 gap-1 grid-rows-3">
          {recipes !== undefined && recipes.length > 0 ? (
            recipes.map( (a, idx) => {
              return (
                <section key={idx} className="w-full h-full min-h-51.5 group relative">
                  <Image src={a.recipe_image} width={300} height={300} alt="liked recipe image" className="w-full rounded-md group-hover:brightness-50 transition-all duration-200 h-full object-cover aspect-square bg-gray-300" />
                  <h1 className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 text-white font-bold text-lg">
                    {a.recipe_name}
                  </h1>
                  <div className={"absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full bottom-4 flex justify-center gap-2"}>
                    <Button>Restore</Button>
                    <Button variant={"destructive"}>Delete</Button>
                  </div>
                </section>
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
      {recipes && total_deleted && recipes.length < total_deleted && (
        <div className={"w-full flex justify-center mt-2"}>
          <Button onClick={() => getMoreArchivedRecipesMutation.mutate()} className={"flex items-center self-center gap-2 bg-primary-text"}>
            Get more recipes
          </Button>
        </div>
      )}
    </>
  )
}