import React from "react";
import LikeRecipe from "@/app/(public)/recipe/show/[recipeId]/[recipeName]/components/like-recipe";
import {ServerApiResponseService, ServerApiService} from "@/lib/server-utils";
import z from "zod";
import {UserSchema} from "@/types/user-types.user";

type LikeRecipeButtonProps = {
  total_likes: number;
  recipe_id: number;
  user_data: z.infer<typeof UserSchema.User>;
  recipe_name: string;
}

async function LikeRecipeButton({total_likes, recipe_id, user_data, recipe_name}: LikeRecipeButtonProps) {
  const isLikedResponse = await ServerApiService.get("/is-liked?recipe_id=" + recipe_id);
  const isLiked = await ServerApiResponseService.getResponseData<{is_liked: boolean}>(isLikedResponse);
  return (
    <LikeRecipe total_likes={total_likes} recipe_id={recipe_id} is_liked={isLiked.is_liked} recipe_name={recipe_name}/>
  )
}

interface ShowRecipeTagsProps {
  recipe_age_tag: string;
  recipe_size_tag: string;
  recipe_event_tag: string;
  total_likes: number;
  recipe_id: number;
  user_data: z.infer<typeof UserSchema.User> | undefined;
  recipe_name: string;
}

function Tag({children}: {children: React.ReactNode}) {
  return (
    <p
      className={`bg-primary-text self-center flex justify-center items-center text-white py-[2px] px-[7px] rounded-[5px] text-xs`}
    >
      {children}
    </p>
  )
}
export default async function ShowRecipeTags({recipe_age_tag,recipe_size_tag,recipe_event_tag,total_likes,recipe_id,user_data, recipe_name}: ShowRecipeTagsProps) {

  return (
    <section className={"flex justify-between w-full gap-2"}>
      <div className={`w-full flex gap-[5px] flex-wrap items-center `}>
        {recipe_age_tag !== "" ? (
          recipe_age_tag.split(",").map( (tag, idx) => {
            return (
              <Tag key={idx}>
                {tag}
              </Tag>
            )
          })
        ) : null}
        {recipe_size_tag !== "" ? (
          recipe_size_tag.split(",").map( (tag, idx) => {
            return (
              <Tag key={idx}>
                {tag}
              </Tag>
            )
          })
        ) : null}
        {recipe_event_tag !== "" ? (
          recipe_event_tag.split(",").map( (tag, idx) => {
            return (
              <Tag key={idx}>
                {tag}
              </Tag>
            )
          })
        ) : null}
      </div>

      {user_data !== undefined && <LikeRecipeButton recipe_id={recipe_id} total_likes={total_likes} user_data={user_data} recipe_name={recipe_name} />}
    </section>
  )
}