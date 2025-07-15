interface ShowRecipeTagsProps {
  recipe_age_tag: string;
  recipe_size_tag: string;
  recipe_event_tag: string;
}
export default async function ShowRecipeTags(recipe_data: ShowRecipeTagsProps) {
  return (
    <div className={`w-full flex gap-[5px] flex-wrap items-center `}>
      {recipe_data.recipe_age_tag !== "" ? (
        <span
          className={`bg-[#523636] self-center flex justify-center items-center text-white py-[2px] px-[7px] rounded-[5px] text-xs`}
        >
          {recipe_data.recipe_age_tag}
        </span>
      ) : null}
      {recipe_data.recipe_size_tag !== "" ? (
        <span
          className={`bg-[#523636] self-center flex justify-center items-center text-white py-[2px] px-[7px] rounded-[5px] text-xs`}
        >
          {recipe_data.recipe_size_tag}
        </span>
      ) : null}
      {recipe_data.recipe_event_tag !== "" ? (
        <span
          className={`bg-[#523636] self-center flex justify-center items-center text-white py-[2px] px-[7px] rounded-[5px] text-xs`}
        >
          {recipe_data.recipe_event_tag}
        </span>
      ) : null}
    </div>
  )
}