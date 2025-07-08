"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import RecipeItem from "./recipe-item";
import Autoplay from "embla-carousel-autoplay";
import { RecipeProps } from "./recipe-carousel-wrapper";

interface RecipeCarouselProps {
  recipes: Array<RecipeProps>
}

export default function RecipeCarousel({recipes}: RecipeCarouselProps) {
  return (
    <Carousel
      opts={{
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