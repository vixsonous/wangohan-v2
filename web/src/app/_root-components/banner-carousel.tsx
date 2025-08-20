"use client";
import Image from "@/components/Image/client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import z from "zod";
import {RecipeDisplaySchema} from "@/types/recipe-types";

const items = [
  "/logo/logo-wangohan-front.png",
  "/logo/logo-wangohan-front.png",
  "/logo/logo-wangohan-front.png",
]

export default function BannerCarousel({recipes}: {recipes: Array<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>>}) {

  return (
    <Carousel opts={{loop: true, duration: 50}} plugins={[
      Autoplay({
        delay: 5000
      })
    ]} className="w-full h-[400px] col-span-3">
      <CarouselContent hfull>
        {
          recipes.map((i, x) => {
            return (
              <CarouselItem key={x}>
                <Image className="h-full w-full" src={i.recipe_images[0].recipe_image} alt={i.recipe_images[0].recipe_image_title} width={768} height={400}/>
              </CarouselItem>
            )
          })
        }
      </CarouselContent>
    </Carousel>
  )
}