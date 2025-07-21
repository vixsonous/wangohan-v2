import React from "react";

interface ShowRecipeTagsProps {
  recipe_age_tag: string;
  recipe_size_tag: string;
  recipe_event_tag: string;
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
export default async function ShowRecipeTags(recipe_data: ShowRecipeTagsProps) {
  return (
    <div className={`w-full flex gap-[5px] flex-wrap items-center `}>
      {recipe_data.recipe_age_tag !== "" ? (
        recipe_data.recipe_age_tag.split(",").map( (tag, idx) => {
          return (
            <Tag key={idx}>
              {tag}
            </Tag>
          )
        })
      ) : null}
      {recipe_data.recipe_size_tag !== "" ? (
        recipe_data.recipe_size_tag.split(",").map( (tag, idx) => {
          return (
            <Tag key={idx}>
              {tag}
            </Tag>
          )
        })
      ) : null}
      {recipe_data.recipe_event_tag !== "" ? (
        recipe_data.recipe_event_tag.split(",").map( (tag, idx) => {
          return (
            <Tag key={idx}>
              {tag}
            </Tag>
          )
        })
      ) : null}
    </div>
  )
}