"use client";
import {
  useShowRecipeCommentsForm
} from "@/app/(public)/recipe/show/[recipeId]/[recipeName]/components/show-recipe-comments-form-helper";
import TextareaField from "@/components/Textarea";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import Link from "next/link";
import Error from "@/components/Error";
import Image from "@/components/Image/client";
import Button from "@/components/Button";
import StarReviews from "@/components/StarReviews";
import InputField from "@/components/Input";
import ShowRecipeComments from "@/app/(public)/recipe/show/[recipeId]/[recipeName]/show-recipe-comments";
import z from "zod";
import {RecipeDisplaySchema} from "@/types/recipe-types";
import {Dispatch, SetStateAction, useState} from "react";

type ShowRecipeCommentFormProps = {
  is_logged_in: boolean;
  recipe_id: number;
  setComments: Dispatch<SetStateAction<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments>[]>>
}

function ShowRecipeCommentForm({is_logged_in, recipe_id, setComments}: ShowRecipeCommentFormProps) {
  const {register, errors, handleSubmit, onSubmit, commentSubmitMutation, control} = useShowRecipeCommentsForm(setComments);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative flex justify-center flex-col gap-[10px]" action="">
      { is_logged_in ? (
        <>
          <div className="flex gap-[10px] items-center">
            <StarReviews control={control} large={true} value={0} interactive={true}/>
            <h1>Please enter your review!</h1>
          </div>
          <div className="w-[100%] flex items-center">
            <span className={"hidden"}>
              <InputField hidden={true} {...register("recipe_id", {valueAsNumber: true, value: recipe_id})}/>
            </span>
            <TextareaField {...register("comment")} placeholder="このレシピのレビューを投稿する" className="text-sm px-4 py-2 w-full" name="comment"></TextareaField>
            <Button role={"submit"} className="absolute text-white right-2 top-10" type="submit">
              {
                commentSubmitMutation.isPending ? (
                  <span>Loading</span>
                ) : (
                  <Image noprocess={true} src={"/icons/svg/primary-circle-up-arrow.svg"} className={"h-8 w-8"} alt={"circle up arrow icon for submitting comment"}/>
                )
              }
            </Button>
          </div>
          <div className="w-full">
            {Object.keys(errors).map((err, idx) => idx < 1 && <Error>{errors[err as keyof typeof errors]?.message}</Error>)}
          </div>
        </>
      ) : (
        <div className="w-full text-center text-sm">
          <Link className="text-blue-400 font-bold" href="/login">ログイン</Link>してレビューを書く
        </div>
      )
      }
    </form>
  )
}

type ShowRecipeCommentFormWrapperProps = {
  is_logged_in: boolean;
  recipe_id: number;
  recipe_comments: Array<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments>>;
  total_comments: number;
}

export default function ShowRecipeCommentFormWrapper(props: ShowRecipeCommentFormWrapperProps) {


  const [comments, setComments] = useState<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments>[]>(props.recipe_comments);

  return (
    <QueryClientProvider client={queryClient}>
      <ShowRecipeComments recipe_id={props.recipe_id} comments={comments} total_comments={props.total_comments}/>
      <ShowRecipeCommentForm setComments={setComments} is_logged_in={props.is_logged_in} recipe_id={props.recipe_id}/>
    </QueryClientProvider>
  )
}