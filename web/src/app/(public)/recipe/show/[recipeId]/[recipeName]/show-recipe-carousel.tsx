"use client";

import Button from "@/components/Button";
import Image from "@/components/Image/client";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import React, { useEffect, useState } from "react";
import ShowRecipeDropdown from "./components/show-recipe-dropdown";
import { RecipeImageDisplay } from "@/server-actions/Recipe/recipe-types";

interface ShowRecipeCarouselProps {
  recipe_images: Array<RecipeImageDisplay>;
  recipe_id: number;
  recipe_name: string;
}
export default function ShowRecipeCarousel({recipe_images, recipe_id, recipe_name}: ShowRecipeCarouselProps) {

  const [carouselSlideCnt, setCarouselSlideCnt] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [curSlide, setCurSlide] = useState(0);

  const apiScrollTo = (idx: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(!api) return;
    api.scrollTo(idx);
    setCurSlide(idx);
  }

  useEffect(() => {
    if(!api) return;
    setCurSlide(api.selectedScrollSnap());
    setCarouselSlideCnt(api.scrollSnapList().length);

    api.on("select", () => {
      setCurSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} className="max-w-3xl w-full relative">
      <CarouselContent>
        {recipe_images.map(a => {
          return (
            <CarouselItem className="h-[468px]" key={a.recipe_image_id}>
              <Card className="p-0 h-full bg-transparent border-0">
                <CardContent className="relative bg-transparent w-full h-full flex items-center justify-center p-0 ">
                  <div className='absolute top-0 w-full h-full bg-primary-text opacity-10 -z-10'></div>
                  <Image src={a.recipe_image} className="object-contain bg-transparent relative h-full max-h-[468px] rounded-[0px] w-full max-w-full" width={768} alt="website banner" />
                </CardContent>
              </Card>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious className="border-primary-text top-2/5 left-12 md:-left-12"/>
      <CarouselNext className="border-primary-text top-2/5 right-12 md:-right-12" />
      <ShowRecipeDropdown recipe_id={recipe_id} recipe_name={recipe_name} />
      <div className="absolute flex items-center gap-2 top-2/3 left-1/2 -translate-x-1/2">
        {Array.from(Array(carouselSlideCnt).keys()).map( (c) => {
          return (
            <Button key={c} aria-labelledby={"carousel-button-" + c} onClick={apiScrollTo(c)} className={`w-2 h-2 rounded-full ${(curSlide) === c ? 'bg-bullet' : 'bg-inactive'}`}></Button>
          )
        })}
      </div>
      <Carousel className="pt-4">
        <CarouselContent className="-ml-1">
          {recipe_images.map((i, idx) => {
            return (
              <CarouselItem className={`basis-1/3 lg:basis-1/5 pl-1`} key={i.recipe_image_id}>
                <Button onClick={apiScrollTo(idx)}>
                  <Card className={`p-0 ${curSlide === idx ? 'brightness-100' : 'brightness-90'}`}>
                    <CardContent className="p-0">
                      <Image className="w-full max-h-[112px]" width={170} height={112} src={i.recipe_image} alt="qqwe"/>
                    </CardContent>
                  </Card>
                </Button>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </Carousel>
  )
}