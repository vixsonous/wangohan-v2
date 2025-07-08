import React from "react";
import ThisWeekRecipeCarousel from "./this-week-recipe-carousel";
import RecipeCarousel from "./this-week-recipe-carousel";

export interface RecipeProps {
  recipe_image: string;
  recipe_name: string;
  recipe_id: number;
  recipe_description: string;
  recipe_age_tag: string;
  recipe_size_tag: string;
  recipe_event_tag: string;
  total_likes: number;
  total_views: number;
  user_id: number;
  recipe_rating_data:{
    totalRating: number;
    avgRating: number;
  }
  created_at: Date;
}

interface RecipeCarouselWrapperProps {
  title: string;
  recipes: Array<RecipeProps>;
}
export default async function RecipeCarouselWrapper({title, recipes}: RecipeCarouselWrapperProps) {
  return (
    <section className="grid grid-cols-1 w-full pt-8">
      <header className="relative pb-2.5">
        <h1
          className={`text-2xl z-10 max-w-max pr-4 font-bold tracking-tighter inline-block text-primary-text relative bg-primary-bg`}
        >
          {title}
        </h1>
        <p className="absolute w-full top-5/12 border border-solid border-primary-text" />
      </header>
      <RecipeCarousel recipes={recipes} />
    </section>
  )
}