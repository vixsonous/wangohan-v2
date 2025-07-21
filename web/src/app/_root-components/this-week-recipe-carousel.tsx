"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import RecipeItem from "./recipe-item";
import Autoplay from "embla-carousel-autoplay";
import { RecipeDisplayDetails } from "@/server-actions/Recipe/recipe-types";

interface RecipeCarouselProps {
  recipes: Array<RecipeDisplayDetails>
}

export default function RecipeCarousel({recipes}: RecipeCarouselProps) {
  return (
    <Carousel
      opts={{
        loop: true,
        align: "start",
        slidesToScroll: 1,
      }}
      plugins={[
        Autoplay({
          delay: 2500
        })
      ]} className="w-full">
      <CarouselContent>
        {
          recipes.map( (recipe, idx) => {
            return (
              <CarouselItem className="lg:basis-1/4" key={idx}>
                <RecipeItem {...recipe}/>
              </CarouselItem>
            )
          })
        }
      </CarouselContent>
    </Carousel>
  )
}