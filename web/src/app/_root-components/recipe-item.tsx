"use client";

import Image from "@/components/Image/client";
import Link from "next/link";
import StarReviews from "@/components/StarReviews";
import { RecipeDisplayDetails } from "@/server-actions/recipe-types";

export default function RecipeItem(recipe: RecipeDisplayDetails) {
  return (
    <Link className="w-full" href={`/recipe/show/${recipe.recipe_id}`}>
      <section className="relative flex flex-col gap-[8px]">
        <div className="absolute flex items-center gap-2 px-2 py-1 bg-white rounded-full top-2 right-2 z-50">
          <Image src={"/icons/svg/red-heart-fill.svg"} alt={"red heart fill icon for like"} height={100}/>
          <span className="text-xs font-bold">{recipe.total_likes > 1000 ? `${recipe.total_likes / 1000}k` : recipe.total_likes}</span>
        </div>
        <Image src={recipe.recipe_images[0].recipe_image} loading="lazy" className="will-change-transform object-cover rounded-md w-full h-[100px] sm:h-[130px] lg:h-[170px] max-w-[100%] block" height={300} width={500} />
        <h1 className={`text-xs overflow-hidden text-ellipsis font-bold line-clamp-2`}>{recipe.recipe_name}</h1>
        <div className="flex justify-between mt-[-4px]">
          <div className="flex items-center ml-[-4px]">
              <StarReviews value={recipe.total_likes} interactive={false} large={true}/>
          </div>
          <div className="flex gap-[5px] items-center">
              <span className={`text-xs`}>{recipe.total_views} views</span>
          </div>
        </div>
        <div className={`flex justify-between`}>
          <div className={`w-full flex gap-[5px] flex-wrap items-center `}>
            {recipe.recipe_size_tag === '' && recipe.recipe_age_tag === '' && recipe.recipe_event_tag === '' && (<span className={`bg-[#523636] text-xs opacity-[0] self-center flex justify-center items-center text-white py-[2px] px-[7px] rounded-[5px]`}>Null</span>)}
            {recipe.recipe_size_tag !== '' ? <span className={`bg-[#523636] text-xs self-center flex justify-center items-center text-white py-[2px] px-[7px] rounded-[5px]`}>{recipe.recipe_size_tag}</span> : null}
            {recipe.recipe_age_tag !== '' ? <span className={`bg-[#523636] text-xs self-center flex justify-center items-center text-white py-[2px] px-[7px] rounded-[5px]`}>{recipe.recipe_age_tag}</span> : null}
            {recipe.recipe_event_tag !== '' ? <span className={`bg-[#523636] text-xs self-center flex justify-center items-center text-white py-[2px] px-[7px] rounded-[5px]`}>{recipe.recipe_event_tag}</span> : null}
          </div>
        </div>
      </section>
    </Link>
  )
}