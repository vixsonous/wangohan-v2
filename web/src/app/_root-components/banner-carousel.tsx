"use client";
import Image from "@/components/Image/client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import z from "zod";
import {RecipeDisplaySchema} from "@/types/recipe-types";
import Link from "next/link";

export default function BannerCarousel({recipes}: {recipes: Array<z.infer<typeof RecipeDisplaySchema.RecipeCardDisplay>>}) {

  return (
    <Carousel opts={{loop: true, duration: 50}} plugins={[
      Autoplay({
        delay: 5000
      })
    ]} className="w-full h-52 md:h-full col-span-3">
      <CarouselContent hfull>
        {
          recipes.map((i, x) => {
            return (
              <CarouselItem key={x}>
                <Link href={`/recipe/show/${i.recipe_id}/${i.recipe_name}`}>
                  <Image loading={"eager"} className="h-full w-full object-cover aspect-video" fit={"cover"} src={i.recipe_images[0].recipe_image} alt={i.recipe_images[0].recipe_image_title} width={1024} height={768}/>
                </Link>
              </CarouselItem>
            )
          })
        }
      </CarouselContent>
    </Carousel>
  )
}