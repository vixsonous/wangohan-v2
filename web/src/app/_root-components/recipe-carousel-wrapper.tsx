import React from "react";
import ThisWeekRecipeCarousel from "./this-week-recipe-carousel";
import RecipeCarousel from "./this-week-recipe-carousel";
import { RecipeDisplayDetails } from "@/server-actions/recipe-types";

interface RecipeCarouselWrapperProps {
  title: string;
  recipes: Array<RecipeDisplayDetails>;
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